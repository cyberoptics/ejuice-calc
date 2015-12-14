// IIFE
(function() {
  // shorthand for $(document).ready
  $(function() {
    // Get data
    $.getJSON("/api/recipes", function(json, user) {
      window.recipes = json;
      var foo = recipes.find({user_id: user._id});
      console.log(JSON.stringify(foo));
    });
    
    //Post data
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
    });
    //Put data
    $('#updateRecipe').click(function() {
      //TODO logic for setting $recipe_id
      var $recipe_id = {};
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
        type: 'PUT',
        url: "/api/recipes/" + $recipe_id,
        data: {
          values: $values,
          flavors: $flavors
        }
      });
    });
  });
}());