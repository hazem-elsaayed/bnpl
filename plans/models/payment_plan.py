from django.db import models
from django.conf import settings


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
