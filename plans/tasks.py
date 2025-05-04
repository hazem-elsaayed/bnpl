from celery import shared_task
from plans.management.mark_overdue import mark_overdue_installments
from django.core.mail import send_mail
from django.utils import timezone
from plans.models.installment import Installment
from plans.models.user import User
from django.conf import settings


@shared_task
def mark_overdue_installments_task():
    return mark_overdue_installments()


@shared_task
def send_payment_reminders():
    print("Sending payment reminders...")
    target_date = timezone.now().date() + timezone.timedelta(days=3)
    installments = Installment.objects.filter(status="Pending", due_date=target_date)
    print(
        f"Sending payment reminders for {installments.count()} installments due on {target_date}."
    )
    for inst in installments:
        user_email = inst.plan.user.email
        send_mail(
            subject="BNPL Payment Reminder",
            message=f"Reminder: Your installment of {inst.amount} ريال is due on {inst.due_date}.",
            from_email=getattr(settings, "DEFAULT_FROM_EMAIL", "noreply@example.com"),
            recipient_list=[user_email],
            fail_silently=True,
        )
    return installments.count()
