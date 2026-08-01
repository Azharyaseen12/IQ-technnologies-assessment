"""
Task models module.

This module defines the data models for the task management system,
following the Single Responsibility Principle by keeping data structure
and business logic separate from presentation and control layers.
"""

from django.db import models
from django.core.validators import MinLengthValidator
from django.utils import timezone


class Task(models.Model):
    """
    Represents a single task in the task management system.

    Attributes:
        title: Brief description of the task (required, max 200 chars).
        description: Detailed information about the task (optional).
        completed: Boolean flag indicating completion status.
        created_at: Timestamp when the task was created.
        updated_at: Timestamp when the task was last modified.
        priority: Integer representing task priority (1=High, 2=Medium, 3=Low).
    """

    PRIORITY_CHOICES = [
        (1, 'High'),
        (2, 'Medium'),
        (3, 'Low'),
    ]

    title = models.CharField(
        max_length=200,
        validators=[MinLengthValidator(1)],
        help_text="Brief title describing the task"
    )
    description = models.TextField(
        blank=True,
        default='',
        help_text="Optional detailed description"
    )
    completed = models.BooleanField(
        default=False,
        help_text="Whether the task has been completed"
    )
    priority = models.IntegerField(
        choices=PRIORITY_CHOICES,
        default=2,
        help_text="Task priority level"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        """Meta options for the Task model."""
        ordering = ['-created_at']
        verbose_name = 'Task'
        verbose_name_plural = 'Tasks'
        indexes = [
            models.Index(fields=['completed']),
            models.Index(fields=['priority']),
            models.Index(fields=['created_at']),
        ]

    def __str__(self) -> str:
        """Return a human-readable string representation."""
        status = "✓" if self.completed else "○"
        return f"[{status}] {self.title}"

    def mark_completed(self) -> None:
        """Mark the task as completed."""
        self.completed = True
        self.save(update_fields=['completed', 'updated_at'])

    def mark_incomplete(self) -> None:
        """Mark the task as not completed."""
        self.completed = False
        self.save(update_fields=['completed', 'updated_at'])

    @property
    def is_overdue(self) -> bool:
        """Check if the task is considered overdue (placeholder logic)."""
        # Simple heuristic: tasks older than 7 days and not completed
        if self.completed:
            return False
        return (timezone.now() - self.created_at).days > 7
