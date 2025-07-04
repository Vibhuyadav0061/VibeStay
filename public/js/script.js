document.addEventListener("DOMContentLoaded", function () {
    const forms = document.querySelectorAll('.needs-validation');

    forms.forEach(function (form) {
      form.addEventListener('submit', function (event) {
        if (!form.checkValidity() || !form.querySelector('#comment').value.trim()) {
          event.preventDefault();
          event.stopPropagation();
        }
        form.classList.add('was-validated');
      }, false);
    });
  });

  console.log("perfect")
  