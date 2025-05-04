from django.db import models
from .payment_plan import PaymentPlan
from django.utils import timezone


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
