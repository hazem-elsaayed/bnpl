from rest_framework.views import APIView
from rest_framework.response import Response
from django.utils import timezone
from ..models import Installment


class InstallmentPayView(APIView):
    def post(self, request, id):
        try:
            inst = Installment.objects.select_related("plan").get(id=id)
        except Installment.DoesNotExist:
            return Response({"detail": "Installment not found."}, status=404)
        if inst.plan.user != request.user:
            return Response({"detail": "Not allowed."}, status=403)
        if inst.status == "Paid":
            return Response({"detail": "Already paid."}, status=400)
        inst.status = "Paid"
        inst.paid_at = timezone.now()
        inst.save()
        return Response({"detail": "Payment successful."})
