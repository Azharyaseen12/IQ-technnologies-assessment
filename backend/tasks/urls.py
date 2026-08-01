"""
Task app URL configuration.

Routes task-related API endpoints to their respective view classes.
"""

from django.urls import path
from . import views

urlpatterns = [
    # List all tasks
    path('tasks/', views.TaskListView.as_view(), name='task-list'),

    # Create a new task
    path('tasks/create/', views.TaskCreateView.as_view(), name='task-create'),

    # Retrieve a single task
    path('tasks/<int:pk>/', views.TaskDetailView.as_view(), name='task-detail'),

    # Update a task (PUT full, PATCH partial)
    path('tasks/<int:pk>/update/', views.TaskUpdateView.as_view(), name='task-update'),

    # Delete a task
    path('tasks/<int:pk>/delete/', views.TaskDeleteView.as_view(), name='task-delete'),

    # Toggle completion status
    path('tasks/<int:pk>/toggle/', views.TaskToggleCompleteView.as_view(), name='task-toggle'),
]
