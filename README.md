# SQL_Query_Columns_Description_Generator
Integration of Hubspot, Notion and Airtable to our application


## Prerequisites

- Python 3.8 or higher
- Redis

## Installation guide

1. Clone the repository:
   ```bash
   git clone https://github.com/RitikaRege31/SQL_Query_Columns_Description_Generator
 
2. To run frontend React 
   ```bash 
   cd frontend
   npm install
   npm run start

3. To run Backend server 
   Get your API KEY from sqllineage Developer API 
   In backend/sql_processing/views.y, replace with your api key
   api_key="Your API Key"
   Then run the following commands ina sequence to start the server
   ```bash 
   cd backend
   pip install -r requirements.txt
   python manage.py migrate
   python manage.py createsuperuser
   python manage.py runserver

# Contribution
  Ritika Rege