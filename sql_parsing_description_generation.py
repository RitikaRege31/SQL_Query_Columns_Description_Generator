import os
from sqllineage.runner import LineageRunner
import pandas as pd
import google.generativeai as genai
import time
# Configure the Google Studio AI API key
genai.configure(api_key="AIzaSyDBzCOGz3cQLyNSRdcXeN7oEEO0J9OrQPU")
model = genai.GenerativeModel("gemini-1.5-flash")

# Function to process SQL queries and generate column lineage
def process_sql_file(file_path):
    # Define the file path here; this value can be changed as needed
    file_path = "test.sql"
    
    # Check if the file exists
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"Error: The file {file_path} does not exist.")
    
    with open(file_path, 'r') as file:
        sql_query = file.read()
    
    runner = LineageRunner(sql=sql_query)
    return runner.get_column_lineage()


def generate_column_descriptions(column_lineage):
    descriptions = []
    seen_columns = set()
    
    for lineage in column_lineage:
        target_col = str(lineage[-1])  # Get the target column name
        lineage_str = [str(col) for col in lineage]
        
        # Clean up the column names by removing <default>.
        target_col_cleaned = target_col.replace('<default>.', '')
        lineage_str_cleaned = [col.replace('<default>.', '') for col in lineage_str]

        # Skip already processed columns
        if target_col_cleaned in seen_columns:
            continue

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
            # For tuples with more than two columns
            cols = ", ".join(lineage_str_cleaned)
            prompt = (
                f"Generate a detailed description for a column derived from the following lineage: "
                f"{cols}. The description should include "
                f"how the data is computed or derived, any transformations, and its purpose."
                f" Description precise and at the same time it should contain all necessary information about calculations and purpose."
                f"Descriptions should not exceed 50 words."
            )
        
        # Use Google Studio AI API to generate the description
        response = model.generate_content(prompt)
        description_cleaned = response.text.replace('<default>.', '')
        
        descriptions.append((target_col_cleaned, description_cleaned))
        seen_columns.add(target_col_cleaned) 
        time.sleep(2)  # Add this column to the seen set
    
    return descriptions

def save_to_excel(data, output_file="column_descriptions.xlsx"):
    df = pd.DataFrame(data, columns=["Column Name","Description"])
    df.to_excel(output_file, index=False)
    print(f"Descriptions saved to {output_file}")

# Main function to execute Task 1
def main_task_1(file_paths):
    data = []
    for file_path in file_paths:
        print(f"Processing file: {file_path}")
        column_lineage = process_sql_file(file_path)
        descriptions = generate_column_descriptions(column_lineage)
        for target_col, desc in descriptions:
            data.append([target_col, desc])
    
    save_to_excel(data)

# Example usage
sql_files = ["test2.sql"]  # Replace with your SQL file paths
main_task_1(sql_files)
