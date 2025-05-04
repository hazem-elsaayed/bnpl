from django.db.models.signals import post_save
from django.dispatch import receiver
from .installment import Installment


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
