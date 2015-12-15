// IIFE
(function() {
  // shorthand for $(document).ready
  $(function() {
    $('#welcomeModal').modal('show');
    //probably a better way to do this
    $('input').parent("td").css("padding", "0px 0px");
    $('div.input-group').parent("td").css("padding", "0px 0px");
    // End TODO
    var numIngredient;
    $("#addRow").click(function() {
      numIngredient = $('#ingredients tbody tr').length;
      numIngredient++;
      $("#ingredients tr:last").clone().find('input').val('').end().insertAfter("#ingredients tr:last");
      $("#ingredients tr:last").find('.numIngredient').html(numIngredient + ".");
      $("#ingredients tr:last").find('input[type="number"]').val('0');
    });
    var deleteIngredient = function deleteIngredient() {
      var table = document.getElementById("ingredients");
      var count = $('#ingredients tbody > tr').length;
      if (count > 1) {
        numIngredient--;
        var row = table.deleteRow(-1);
      }
    };
    $("#deleteRow").click(deleteIngredient);
    //////
    // Calculate main function
    //////
    var calculate = function calculate() {
      // set variables
      var total = $('#total').val(),
        targetNic = $('#targetNic').val(),
        targetVg = $('#targetVg').val(),
        baseNic = $('#baseNic').val(),
        baseNicWeight = $('#baseNicWeight').val(),
        targetVgWeight = $('#targetVgWeight').val(),
        targetPgWeight = 1.038;
      //remove flavors so no repetitions when calculating 2+ times 
      $("#output tbody").find("tr:gt(2)").remove();
      // set Nic values in output table
      if (targetNic == 0 || baseNic == 0) {
        $("#output tbody").find("tr:eq(0)").find("td:eq(1)").text("0");
        $("#output tbody").find("tr:eq(0)").find("td:eq(2)").text("0");
      } else {
        // calculate bases
        var nicMl = (targetNic / baseNic * total).toFixed(3);
        var nicPercent = parseFloat(nicMl * 100 / total);
        $("#output tbody").find("tr:eq(0)").find("td:eq(1)").text(nicMl);
        $("#output tbody").find("tr:eq(0)").find("td:eq(2)").text(nicPercent);
      }
      // Calculate Flavors
      $("#ingredients tbody > tr").each(function() {
        var $self = $(this),
          $data = $self.find("td");
        if ($($data[1]).find("input").first().val().length !== 0) {
          var $name = $($data[1]).find("input").first().val();
          var $percent = $($data[2]).find("input").first().val();
          var $mL = ($percent / 100 * total).toFixed(3);
          var $weight = ($($data[3]).find("input").first().val() * $mL);
          //          console.log("name = " + $name + " percent = " + $percent);
          $("#output tr:last").clone().find('input').val('').end().insertAfter("#output tr:last");
          $("#output tr:last").find("td:eq(0)").text($name);
          $("#output tr:last").find("td:eq(1)").text($mL);
          $("#output tr:last").find("td:eq(2)").text($percent);
          $("#output tr:last").find("td:eq(3)").text($weight.toFixed(3) + " mg");
        }
      });

      function calculateTotalPercent() {
        var totalPercent = (parseFloat(nicPercent));
        $("#ingredients tbody > tr").each(function() {
          var $self = $(this),
            $data = $self.find("td");
          if ($($data[1]).find("input").first().val().length !== 0) {
            var $percent = parseFloat($($data[2]).find("input").first().val());
            totalPercent = totalPercent + $percent;
          }
          window.totalPercent = totalPercent;
          console.log("Ingredients + Nic = " + totalPercent + "%");
        });
      }
      //set VG values in output
      calculateTotalPercent();
      if ($('#maxVg').is(':checked')) {
        targetVg = parseFloat(100 - totalPercent);
        $("#output tbody").find("tr:eq(2)").find("td:eq(1)").text(0);
        $("#output tbody").find("tr:eq(2)").find("td:eq(2)").text(0);
      }
      var vgMl = (targetVg * total / 100).toFixed(3);
      targetPg = parseFloat(100 - totalPercent - targetVg);
      var pgMl = (targetPg * total / 100).toFixed(3);
      var nicWeight = (nicMl * baseNicWeight);
      var vgWeight = (vgMl * targetVgWeight);
      var pgWeight = (pgMl * targetPgWeight);
      $("#output tbody").find("tr:eq(0)").find("td:eq(3)").text(nicWeight.toFixed(3) + " mg");
      $("#output tbody").find("tr:eq(1)").find("td:eq(1)").text(vgMl);
      $("#output tbody").find("tr:eq(1)").find("td:eq(2)").text(targetVg);
      $("#output tbody").find("tr:eq(1)").find("td:eq(3)").text(vgWeight.toFixed(3) + " mg");
      $("#output tbody").find("tr:eq(2)").find("td:eq(1)").text(pgMl);
      $("#output tbody").find("tr:eq(2)").find("td:eq(2)").text(targetPg);
      $("#output tbody").find("tr:eq(2)").find("td:eq(3)").text(pgWeight.toFixed(3) + " mg");
      if (nicPercent <= 100) {
        calculateTotalPercent();
      } else {
        $("#output tbody").find("tr:eq(0)").find("td:eq(1)").text("0");
        $("#output tbody").find("tr:eq(0)").find("td:eq(2)").text("0");
        if (nicPercent !== undefined) {
          alert("Base Nicotine concentration is too low for the desired mixture");
        }
      }
      //fix NaN outputs
      $("#output td.mL, #output td.total").each(function() {
        var $self = $(this);
        if (isNaN($self.text())) {
          $self.text(0);
        }
      });
    };
    $('#calculate').click(calculate);
    // Handle styling of Max VG
    var maxVg = function maxVg() {
      if ($('#maxVg').is(':checked')) {
        $('.hideTarget').css("display", "none");
      } else {
        $('.hideTarget').css("display", "table-row");
      }
    };
    $('#maxVg').change(maxVg);
  });
}());