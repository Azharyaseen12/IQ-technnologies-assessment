"""Django admin configuration for the tasks app."""

from django.contrib import admin
from .models import Task


@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    """Admin interface configuration for Task model."""

    list_display = ('title', 'completed', 'priority', 'created_at', 'updated_at')
    list_filter = ('completed', 'priority', 'created_at')
    search_fields = ('title', 'description')
    ordering = ('-created_at',)
    date_hierarchy = 'created_at'
