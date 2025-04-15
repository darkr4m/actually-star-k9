from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _
import re

def validate_name(name:str) -> str:
    """
    Validates that the name meets basic criteria:
    - Not empty or just whitespace.
    - Contains at least one letter.
    - Is at least 2 characters long.
    - Does not contain newline characters.
    """
    error_message = _("Improper name format. Names should be more than 2 characters and can only contain spaces, hyphens, and apostrophes.")
    if not isinstance(name, str):
        raise ValidationError(_("Invalid input type for name. Name should be a string."), code='invalid_type')
    
    stripped_name = name.strip()

    # Check for empty or whitespace-only
    if not stripped_name:
        raise ValidationError(_("Name cannot be empty or contain only whitespace."), code='empty_name')
    
    regex = r"^[a-zA-Z' -]+$"

    good_name = re.match(regex, name)

    if good_name:
        return name
    else:
        raise ValidationError(error_message, params={ 'name':name })