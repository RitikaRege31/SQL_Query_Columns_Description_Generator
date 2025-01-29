from django.shortcuts import render

# Create your views here.
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import SQLFile
import os
import re
import time
from sqllineage.runner import LineageRunner
import google.generativeai as genai

# Configure Google AI API key
genai.configure(api_key="AIzaSyDBzCOGz3cQLyNSRdcXeN7oEEO0J9OrQPU")
model = genai.GenerativeModel("gemini-1.5-flash")

@csrf_exempt
def upload_sql_files(request):
    if request.method == 'POST':
        files = request.FILES.getlist('files')  # Get uploaded files
        for file in files:
            name = file.name
            content = file.read().decode('utf-8')  # Read file content
            
            # Save the file content to the database
            SQLFile.objects.create(name=name, content=content)
        
        return JsonResponse({"message": "SQL files uploaded successfully."}, status=201)
    
    return JsonResponse({"error": "Invalid request method."}, status=405)


def extract_relations(query):
    """Extract SQL operations from a query using regex patterns."""
    relations = []
    
    if re.search(r'\bJOIN\b', query, re.IGNORECASE):
        relations.append("JOIN")
    if re.search(r'\bUNION\b', query, re.IGNORECASE):
        relations.append("UNION")
    if re.search(r'\bLEFT JOIN\b', query, re.IGNORECASE):
        relations.append("LEFT JOIN")
    if re.search(r'\bRIGHT JOIN\b', query, re.IGNORECASE):
        relations.append("RIGHT JOIN")
    if re.search(r'\bINNER JOIN\b', query, re.IGNORECASE):
        relations.append("INNER JOIN")
    if re.search(r'\bOUTER JOIN\b', query, re.IGNORECASE):
        relations.append("OUTER JOIN")
    
    # Check for mathematical operations
    if re.search(r'\+', query):
        relations.append("Addition")
    if re.search(r'-', query):
        relations.append("Subtraction")
    if re.search(r'\*', query):
        relations.append("Multiplication")
    if re.search(r'/', query):
        relations.append("Division")

    return relations if relations else ["UNKNOWN"]

def process_sql_queries(request):
    if request.method == 'GET':
        # Fetch all SQL file contents from the database
        sql_files = SQLFile.objects.all()
        
        results = []
        lineage_data = [] # For storing raw lineage data to generate graph
        seen_columns = set()  # Track processed columns
        
        for sql_file in sql_files:
            runner = LineageRunner(sql=sql_file.content)
            column_lineage = runner.get_column_lineage()
            
            for lineage in column_lineage:
                source_cols = [str(col) for col in lineage[:-1]]
                target_col = str(lineage[-1]).replace('<default>.', '')
                lineage_str = [str(col) for col in lineage]

                relations = extract_relations(sql_file.content)

                nodes = [{"id": col, "data": {"label": col}} for col in source_cols]
                nodes.append({"id": target_col, "data": {"label": target_col, "is_target": True}})

                edges = [
                    {
                        "id": f"{source}-{target_col}",
                        "source": source,
                        "target": target_col,
                        "data": {"label": relations[i] if i < len(relations) else "UNKNOWN"}
                    }
                    for i, source in enumerate(source_cols)
                ]

                lineage_data.append({"nodes": nodes, "edges": edges})
                
                # Clean column names
                target_col_cleaned = target_col.replace('<default>.', '')
                lineage_str_cleaned = [col.replace('<default>.', '') for col in lineage_str]
                
                # Skip already processed columns
                if target_col_cleaned in seen_columns:
                    continue
                
                
                if len(lineage_str_cleaned) == 2:
                    source_cols, target_col_cleaned = lineage_str_cleaned
                    prompt = (
                        f"Generate a detailed description for the column {target_col_cleaned} in "
                        f"relation to the column {source_cols}. The description should include "
                        f"how the data is computed or derived, any transformations, and its purpose."
                        f"Description precise and at the same time it should contain all necessary information about calculations and purpose."
                        f"Descriptions should not exceed 50 words."
                    )
                else:
                    cols = ", ".join(lineage_str_cleaned)
                    prompt = (
                        f"Generate a detailed description for a column derived from the following lineage: "
                        f"{cols}. The description should include "
                        f"how the data is computed or derived, any transformations, and its purpose."
                        f" Description precise and at the same time it should contain all necessary information about calculations and purpose."
                        f"Descriptions should not exceed 50 words."
                    )
                if request.GET.get('action') == 'description':
                    # Use Google Generative AI to generate the description
                    response = model.generate_content(prompt)
                    description_cleaned = response.text.replace('<default>.', '')
                    
                    results.append({
                        "target_column": target_col_cleaned,
                        "description": description_cleaned
                    })
                
                # Mark column as processed
                seen_columns.add(target_col_cleaned)
                time.sleep(2)
        if request.GET.get('action') != 'description':
            return JsonResponse({"lineage_data": lineage_data}, status=200)
        return JsonResponse({"results": results}, status=200)
    
    return JsonResponse({"error": "Invalid request method."}, status=405)