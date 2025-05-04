from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db.models import Sum
from ..models import PaymentPlan, Installment
from .permissions import IsMerchant


@api_view(["GET"])
@permission_classes([IsAuthenticated, IsMerchant])
def merchant_analytics(request):
    merchant = request.user
    plans = PaymentPlan.objects.filter(merchant=merchant)
    total_revenue = (
        Installment.objects.filter(plan__merchant=merchant, status="Paid").aggregate(
            total=Sum("amount")
        )["total"]
        or 0
    )
    overdue_plans = plans.filter(installments__status="Late").distinct().count()
    total_plans = plans.count()
    paid_plans = plans.filter(status="Paid").count()
    success_rate = (paid_plans / total_plans * 100) if total_plans else 0
    return Response(
        {
            "total_revenue": total_revenue,
            "overdue_plans": overdue_plans,
            "success_rate": round(success_rate, 2),
        }
    )
