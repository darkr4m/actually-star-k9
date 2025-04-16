from django.apps import AppConfig
from django.utils.translation import gettext_lazy as _


class DogsAppConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'dogs_app'
    verbose_name = _('Dogs')
