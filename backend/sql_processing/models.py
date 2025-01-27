from django.db import models

# Create your models here.

class SQLFile(models.Model):
    name = models.CharField(max_length=255)  # Name of the SQL file
    content = models.TextField()  # Content of the SQL file
    uploaded_at = models.DateTimeField(auto_now_add=True)  # Upload timestamp