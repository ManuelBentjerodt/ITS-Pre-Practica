from django.shortcuts import render, redirect
from ...models import Account
from django.contrib.auth.models import User, auth
from django.contrib import messages



def sign_up(request):
    if request.method == 'POST':

        # username = request.POST.get("username")
        username = request.POST["username"]
        email = request.POST['email']
        password = request.POST['password']
        password2 = request.POST['password2']

        if password == password2:
            if User.objects.filter(email=email).exists():
                messages.info(request, 'Email ya existe')
                return redirect('sign_up')

            else:
                user = User.objects.create_user(
                    username=username,
                    email=email,
                    password=password,
                )
                user.save()

                user_login = auth.authenticate(
                    username=username,
                    email=email,
                    password=password
                )
                auth.login(request, user_login)

                user_model = User.objects.get(email=email)
                new_profile = Account.objects.create(user=user_model, id=user_model.id, email=email)

                new_profile.save()

                return redirect('sign_in')

        else:
            messages.info(request, 'Las contraseñas no coinciden')
            return redirect('general/sign_up')

    else:
        return render(request, 'general/sign_up.html')

