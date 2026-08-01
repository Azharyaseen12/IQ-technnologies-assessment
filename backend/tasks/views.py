"""
Task API views module.

This module defines REST API endpoints for task management,
using Django REST Framework's generic views for consistency.

Design follows SOLID principles:
- Single Responsibility: Each view class handles one operation
- Open/Closed: Base classes can be extended without modification
- Dependency Inversion: Views depend on abstractions (serializers, queryset)
"""

from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.exceptions import NotFound
from django.shortcuts import get_object_or_404

from .models import Task
from .serializers import (
    TaskListSerializer,
    TaskDetailSerializer,
    TaskCreateSerializer,
    TaskUpdateSerializer,
)


class TaskListView(generics.ListAPIView):
    """
    GET /api/tasks/

    Returns a paginated list of all tasks.
    Supports ordering and search via query parameters.
    """

    queryset = Task.objects.all()
    serializer_class = TaskListSerializer


class TaskDetailView(generics.RetrieveAPIView):
    """
    GET /api/tasks/<id>/

    Returns detailed information for a single task.
    """

    queryset = Task.objects.all()
    serializer_class = TaskDetailSerializer
    lookup_field = 'pk'


class TaskCreateView(generics.CreateAPIView):
    """
    POST /api/tasks/

    Creates a new task with validated data.
    Returns the created task with full details.
    """

    queryset = Task.objects.all()
    serializer_class = TaskCreateSerializer

    def create(self, request, *args, **kwargs):
        """Override create to return full detail serializer after creation."""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        task = serializer.save()

        # Return full detail response
        detail_serializer = TaskDetailSerializer(task)
        return Response(detail_serializer.data, status=status.HTTP_201_CREATED)


class TaskUpdateView(generics.UpdateAPIView):
    """
    PUT /api/tasks/<id>/
    PATCH /api/tasks/<id>/

    Updates an existing task. Supports partial updates via PATCH.
    """

    queryset = Task.objects.all()
    serializer_class = TaskUpdateSerializer
    lookup_field = 'pk'

    def update(self, request, *args, **kwargs):
        """Override update to return full detail serializer after update."""
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(
            instance, data=request.data, partial=partial
        )
        serializer.is_valid(raise_exception=True)
        task = serializer.save()

        detail_serializer = TaskDetailSerializer(task)
        return Response(detail_serializer.data)


class TaskDeleteView(generics.DestroyAPIView):
    """
    DELETE /api/tasks/<id>/

    Deletes a task permanently.
    """

    queryset = Task.objects.all()
    lookup_field = 'pk'

    def destroy(self, request, *args, **kwargs):
        """Override destroy to return a confirmation message."""
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(
            {"message": f"Task '{instance.title}' deleted successfully."},
            status=status.HTTP_200_OK
        )


class TaskToggleCompleteView(generics.GenericAPIView):
    """
    PATCH /api/tasks/<id>/toggle/

    Toggles the completion status of a task.
    Returns the updated task details.
    """

    queryset = Task.objects.all()
    lookup_field = 'pk'

    def patch(self, request, *args, **kwargs):
        task = self.get_object()
        task.completed = not task.completed
        task.save(update_fields=['completed', 'updated_at'])

        serializer = TaskDetailSerializer(task)
        return Response(serializer.data)
