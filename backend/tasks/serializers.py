"""
Task serializers module.

This module defines data serialization/deserialization logic,
separating the data transformation concern from views and models.
"""

from rest_framework import serializers
from .models import Task


class TaskListSerializer(serializers.ModelSerializer):
    """
    Lightweight serializer for task list views.

    Excludes heavy fields to optimize list endpoint performance.
    Follows Interface Segregation Principle by providing only
    the fields needed for list display.
    """

    priority_display = serializers.CharField(
        source='get_priority_display',
        read_only=True
    )

    class Meta:
        model = Task
        fields = ['id', 'title', 'completed', 'priority', 'priority_display', 'created_at']


class TaskDetailSerializer(serializers.ModelSerializer):
    """
    Full serializer for task detail views.

    Includes all fields for complete task representation.
    """

    priority_display = serializers.CharField(
        source='get_priority_display',
        read_only=True
    )
    is_overdue = serializers.BooleanField(read_only=True)

    class Meta:
        model = Task
        fields = [
            'id', 'title', 'description', 'completed',
            'priority', 'priority_display', 'is_overdue',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']


class TaskCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for task creation.

    Validates input data before creating a new Task instance.
    Follows Single Responsibility by handling only creation logic.
    """

    class Meta:
        model = Task
        fields = ['title', 'description', 'priority']

    def validate_title(self, value: str) -> str:
        """Validate that title is not empty or whitespace only."""
        if not value or not value.strip():
            raise serializers.ValidationError("Title cannot be empty.")
        return value.strip()


class TaskUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer for task updates.

    Allows partial updates and validates modified fields.
    """

    class Meta:
        model = Task
        fields = ['title', 'description', 'completed', 'priority']

    def validate_title(self, value: str) -> str:
        """Validate that title is not empty on update."""
        if value is not None and not value.strip():
            raise serializers.ValidationError("Title cannot be empty.")
        return value.strip() if value else value
