from django.shortcuts import render

# Create your views here.
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import SQLFile
import os

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

def process_sql_queries(request):
    if request.method == 'GET':
        # Fetch all SQL file contents from the database
        sql_files = SQLFile.objects.all()
        
        results = []
        seen_columns = set()  # Track processed columns
        
        for sql_file in sql_files:
            runner = LineageRunner(sql=sql_file.content)
            column_lineage = runner.get_column_lineage()
            
            for lineage in column_lineage:
                target_col = str(lineage[-1])
                lineage_str = [str(col) for col in lineage]
                
                # Clean column names
                target_col_cleaned = target_col.replace('<default>.', '')
                lineage_str_cleaned = [col.replace('<default>.', '') for col in lineage_str]
                
                # Skip already processed columns
                if target_col_cleaned in seen_columns:
                    continue
                
                # Generate prompt based on lineage length
                if len(lineage_str_cleaned) == 2:
                    source_col, target_col_cleaned = lineage_str_cleaned
                    prompt = (
                        f"Generate a detailed description for the column {target_col_cleaned} in "
                        f"relation to the column {source_col}. The description should include "
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
        
        return JsonResponse({"results": results}, status=200)
    
    return JsonResponse({"error": "Invalid request method."}, status=405)