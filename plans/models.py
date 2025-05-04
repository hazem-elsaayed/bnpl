from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings
from django.utils import timezone
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import *  # Import all models from models/__init__.py
from .models.signals import *  # Ensure signals are registered


class User(AbstractUser):
    ROLE_CHOICES = (
        ("merchant", "Merchant"),
        ("user", "User"),
    )
    role = models.CharField(max_length=10, choices=ROLE_CHOICES)


class PaymentPlan(models.Model):
    merchant = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="created_plans"
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="plans"
    )
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    num_installments = models.PositiveIntegerField()
    start_date = models.DateField()
    status = models.CharField(max_length=20, default="Active")  # Active, Paid, Overdue
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Plan {self.id} for {self.user.email}"


class Installment(models.Model):
    plan = models.ForeignKey(
        PaymentPlan, on_delete=models.CASCADE, related_name="installments"
    )
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    due_date = models.DateField()
    status = models.CharField(
        max_length=10,
        choices=[("Pending", "Pending"), ("Paid", "Paid"), ("Late", "Late")],
        default="Pending",
    )
    paid_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"Installment {self.id} for Plan {self.plan.id}"


def update_plan_status(plan):
    total = plan.installments.count()
    paid = plan.installments.filter(status="Paid").count()
    if paid == total and total > 0:
        plan.status = "Paid"
        plan.save(update_fields=["status"])
    elif plan.installments.filter(status="Late").exists():
        plan.status = "Overdue"
        plan.save(update_fields=["status"])
    else:
        plan.status = "Active"
        plan.save(update_fields=["status"])


@receiver(post_save, sender=Installment)
def update_payment_plan_status(sender, instance, **kwargs):
    update_plan_status(instance.plan)
