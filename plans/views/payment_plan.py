from rest_framework import generics, permissions, serializers
from django.db import transaction
from django.utils import timezone
from datetime import timedelta
from ..models import PaymentPlan, Installment, User
from ..serializers import PaymentPlanSerializer
from .permissions import IsMerchant


class PaymentPlanListCreateView(generics.ListCreateAPIView):
    serializer_class = PaymentPlanSerializer

    def get_queryset(self):
        user = self.request.user
        if user.role == "merchant":
            return PaymentPlan.objects.filter(merchant=user)
        return PaymentPlan.objects.filter(user=user)

    def get_permissions(self):
        if self.request.method == "POST":
            return [IsMerchant()]
        return [permissions.IsAuthenticated()]

    @transaction.atomic
    def perform_create(self, serializer):
        merchant = self.request.user
        user_email = self.request.data.get("user_email")
        num_installments = int(self.request.data.get("num_installments"))
        total_amount = float(self.request.data.get("total_amount"))
        start_date = self.request.data.get("start_date")
        try:
            user = User.objects.get(email=user_email, role="user")
        except User.DoesNotExist:
            raise serializers.ValidationError(
                {"user_email": "User not found or not a user."}
            )
        plan = serializer.save(merchant=merchant, user=user)
        # Auto-generate installments
        amount_per = round(total_amount / num_installments, 2)
        due_date = timezone.datetime.strptime(start_date, "%Y-%m-%d").date()
        for i in range(num_installments):
            Installment.objects.create(
                plan=plan, amount=amount_per, due_date=due_date + timedelta(days=30 * i)
            )
