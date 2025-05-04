from django.core.management.base import BaseCommand
from plans.models import Installment
from django.utils import timezone


class Command(BaseCommand):
    help = "Mark overdue installments as Late"

    def handle(self, *args, **kwargs):
        today = timezone.now().date()
        overdue = Installment.objects.filter(status="Pending", due_date__lt=today)
        count = overdue.update(status="Late")
        self.stdout.write(self.style.SUCCESS(f"Marked {count} installments as Late."))
