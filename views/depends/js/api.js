// IIFE
(function() {
  // shorthand for $(document).ready
  $(function() {
    // Get data
    function getData() {
      $('#recipeSelect').find('option').remove().end().append('<option value="default">--Select a Recipe--</option>').val();
      $.getJSON("/api/recipes", function(json, user) {
        window.recipes = json;
        var userId = $('#userId').text();
        var list = document.getElementById("recipeSelect");
        for (var i = 0; i < recipes.length; i++) {
          if (recipes[i].user_id == userId) {
            console.log(recipes[i].name);
            list.add(new Option(recipes[i].name, recipes[i]._id));
          }
        }
      });
    }
    getData();
    // Save Recipe (Post data)
    $('#saveRecipe').click(function() {
      var $name = $('#recipeName').val();
      var $values = [];
      $('.values').each(function() {
        var $self = $(this);
        $values.push($self.val());
      });
      var $flavors = [];
      $('.flavors').each(function() {
        var $self = $(this);
        $flavors.push($self.val());
      });
      $.ajax({
        type: 'POST',
        url: "/api/recipes",
        data: {
          name: $name,
          values: $values,
          flavors: $flavors
        }
      });
      $('#recipeName').val("");
      $('#recipeSavedModal').modal('show');
    });
    // once saved, update values of dropdown upon modal dismissal
    $('#recipeSavedModal').on('hidden.bs.modal', function() {
      getData();
    });
    // Load values upon option selection
    var selection;
    $('#recipeSelect').change(function() {
      var $self = $(this);
      var $val = $self.val();
      if ($val !== "default") {
        $("#ingredients tbody").find("tr:gt(0)").remove();
        $.getJSON("/api/recipes/" + $val, function(json) {
          recipe = json;
          name = recipe.name;
          values = recipe.values;
          flavors = recipe.flavors;
          var i = 0;
          $.each($('.values'), function() {
            var $self = $(this);
            $self.val(values[i]);
            i++;
          });
          $('#recipeName').val(name);
          // create rows for filling in ingredients
          var numIngredient = $('#ingredients tbody tr').length;
          for (i = 3; i < flavors.length; i += 3) {
            numIngredient++;
            $("#ingredients tr:last").clone().find('input').val('').end().insertAfter("#ingredients tr:last");
            $("#ingredients tr:last").find('.numIngredient').html(numIngredient + ".");
          }
          i = 0;
          $.each($('.flavors'), function() {
            var $self = $(this);
            $self.val(flavors[i]);
            i++;
          });
        });
      } else {
        $.each($('.values'), function() {
          var $self = $(this);
          $self.val(0);
        });
        $("#ingredients tbody").find("tr:gt(0)").remove();
        $.each($('.flavors'), function() {
          var $self = $(this);
          $self.val("");
        });
        $('#recipeName').val("");
      }
    });
    //Update Recipe (Put data)
    $('#updateRecipe').click(function() {
      var $name = $('#recipeName').val();
      var recipeId = $('#recipeSelect option:selected').val();
      var $values = [];
      $.each($('.values'), function() {
        var $self = $(this);
        var data = $self.val();
        $values.push(data);
      });
      var $flavors = [];
      $.each($('.flavors'), function() {
        var $self = $(this);
        var data = $self.val();
        $flavors.push(data);
      });
      //alert("$values and $flavors = " + $values + ", " + $flavors);
      $.ajax({
        type: 'PUT',
        url: "/api/recipes/" + recipeId,
        data: {
          name: $name,
          values: $values,
          flavors: $flavors
        },
        success: function(response) {
          $('#recipeUpdatedModal').modal('show');
        }
      });
    });
    // Delete a recipe
    $('#deleteRecipe').click(function() {
      $('#deleteModal').modal('show');
    });
    //actual delete after confirmation
    $('#confirmDelete').click(function() {
      var recipeSelect = $('#recipeSelect option:selected').val();
      if (recipeSelect !== 'default') {
        $.ajax({
          type: 'DELETE',
          url: "/api/recipes/" + recipeSelect,
          success: function(response) {
            $('#deleteModal').modal('hide');
            getData();
          }
        });
      }
    });
  });
}());
