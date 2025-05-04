from django.urls import path
from .views import PaymentPlanListCreateView, InstallmentPayView, merchant_analytics

urlpatterns = [
    path("plans/", PaymentPlanListCreateView.as_view(), name="plan-list-create"),
    path(
        "installments/<int:id>/pay/",
        InstallmentPayView.as_view(),
        name="installment-pay",
    ),
    path("analytics/", merchant_analytics, name="merchant-analytics"),
]
