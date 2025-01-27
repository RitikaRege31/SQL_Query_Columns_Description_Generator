from django.urls import path
from .views import upload_sql_files, process_sql_queries

urlpatterns = [
    path('upload/', upload_sql_files, name='upload_sql_files'),
    path('process/', process_sql_queries, name='process_sql_queries'),
]