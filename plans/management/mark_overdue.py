from django.utils import timezone
from plans.models.installment import Installment


def mark_overdue_installments():
    today = timezone.now().date()
    overdue = Installment.objects.filter(status="Pending", due_date__lt=today)
    count = overdue.update(status="Late")
    return count
