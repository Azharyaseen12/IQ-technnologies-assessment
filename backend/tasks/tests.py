"""
Unit tests for the tasks application.

Tests cover model behavior, API endpoints, and serializer validation
to ensure correctness and prevent regressions.
"""

from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from .models import Task


class TaskModelTests(TestCase):
    """Tests for Task model behavior and business logic."""

    def setUp(self):
        """Set up test data."""
        self.task = Task.objects.create(
            title="Test Task",
            description="Test Description",
            priority=1
        )

    def test_task_creation(self):
        """Test that a task can be created with valid data."""
        self.assertEqual(self.task.title, "Test Task")
        self.assertFalse(self.task.completed)
        self.assertEqual(self.task.priority, 1)

    def test_task_string_representation(self):
        """Test the string representation of a task."""
        self.assertIn("Test Task", str(self.task))
        self.assertIn("○", str(self.task))  # Incomplete marker

    def test_mark_completed(self):
        """Test marking a task as completed."""
        self.task.mark_completed()
        self.assertTrue(self.task.completed)

    def test_mark_incomplete(self):
        """Test marking a completed task as incomplete."""
        self.task.mark_completed()
        self.task.mark_incomplete()
        self.assertFalse(self.task.completed)

    def test_task_ordering(self):
        """Test that tasks are ordered by created_at descending."""
        task2 = Task.objects.create(title="Second Task")
        tasks = list(Task.objects.all())
        self.assertEqual(tasks[0], task2)
        self.assertEqual(tasks[1], self.task)


class TaskAPITests(APITestCase):
    """Tests for Task API endpoints."""

    def setUp(self):
        """Set up test data for API tests."""
        self.task = Task.objects.create(
            title="API Test Task",
            description="API Test Description",
            priority=2
        )
        self.list_url = reverse('task-list')
        self.create_url = reverse('task-create')

    def test_list_tasks(self):
        """Test GET /api/tasks/ returns task list."""
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('results', response.data)

    def test_create_task(self):
        """Test POST /api/tasks/create/ creates a new task."""
        data = {
            "title": "New API Task",
            "description": "Created via API",
            "priority": 1
        }
        response = self.client.post(self.create_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['title'], "New API Task")

    def test_create_task_invalid(self):
        """Test creating a task with invalid data returns error."""
        data = {"title": "", "priority": 1}
        response = self.client.post(self.create_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_retrieve_task(self):
        """Test GET /api/tasks/<id>/ returns task details."""
        url = reverse('task-detail', kwargs={'pk': self.task.pk})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], "API Test Task")

    def test_update_task(self):
        """Test PATCH /api/tasks/<id>/update/ updates a task."""
        url = reverse('task-update', kwargs={'pk': self.task.pk})
        data = {"title": "Updated Title"}
        response = self.client.patch(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], "Updated Title")

    def test_delete_task(self):
        """Test DELETE /api/tasks/<id>/delete/ removes a task."""
        url = reverse('task-delete', kwargs={'pk': self.task.pk})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(Task.objects.filter(pk=self.task.pk).exists())

    def test_toggle_complete(self):
        """Test PATCH /api/tasks/<id>/toggle/ toggles completion."""
        url = reverse('task-toggle', kwargs={'pk': self.task.pk})
        response = self.client.patch(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['completed'])

        # Toggle back
        response = self.client.patch(url)
        self.assertFalse(response.data['completed'])
