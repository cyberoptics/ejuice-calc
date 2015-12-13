    //Cookies
    var today = new Date();
    var expiry = new Date(today.getTime() + 365 * 24 * 3600 * 1000); // plus 1 year
    var expired = new Date(today.getTime() - 24 * 3600 * 1000); // less 24 hours
    function setCookie(name, value) {
      document.cookie = name + "=" + escape(value) + "; path=/; expires=" + expiry.toGMTString();
    }

    function deleteCookie(name) {
      document.cookie = name + "=null; path=/; expires=" + expired.toGMTString();
    }

    function storeValues() {
      var values = [];
      $('td input').each(function() {
        var $self = $(this).val();
        values.push($self);
      });
      setCookie("Values", values);
      console.log("values saved");
    }

    function getCookie(name) {
      var re = new RegExp(name + "=([^;]+)");
      var value = re.exec(document.cookie);
      return (value !== null) ? unescape(value[1]) : null;
    }

    function setInputs() {
      var values = getCookie("Values").split(',');
      var numIngredient = 2;
      console.log("values.length = " + values.length);
      for (i = 9; i < values.length; i += 3) {
        $("#ingredients tr:last").clone().find('input').val('').end().insertAfter("#ingredients tr:last");
        $("#ingredients tr:last").find('.numIngredient').html(numIngredient + ".");
        numIngredient++;
      }
      for (i = 0; i < values.length; i++) {
        $('td input').eq(i).val(values[i]);
      }
    }
    // shorthand for $(document).ready
    $(function() {
      setInputs();
    });
