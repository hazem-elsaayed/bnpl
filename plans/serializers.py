from rest_framework import serializers
from .models import User, PaymentPlan, Installment
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email", "role"]


class InstallmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Installment
        fields = ["id", "amount", "due_date", "status", "paid_at"]
        read_only_fields = ["status", "paid_at"]


class PaymentPlanSerializer(serializers.ModelSerializer):
    installments = InstallmentSerializer(many=True, read_only=True)
    merchant = UserSerializer(read_only=True)
    user = UserSerializer(read_only=True)

    class Meta:
        model = PaymentPlan
        fields = [
            "id",
            "merchant",
            "user",
            "total_amount",
            "num_installments",
            "start_date",
            "status",
            "installments",
            "created_at",
        ]
        read_only_fields = ["status", "installments", "created_at"]


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token["role"] = user.role
        token["email"] = user.email
        token["username"] = user.username
        return token
