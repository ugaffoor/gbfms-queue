# Kinetic Core Angular Components

## Prerequisites

* Angular 1.4.x
* Angular UI-Bootstrap 1.2.x
* Restangular 1.5.x
* MomentJS 2.12.x
* Toastr 2.1.x

* Bootstrap
* Font-Awesome


## Components

### Gravatar

Usage:
```
<gravatar email="person@company.com" width="20" height="20" default-image="mm" name="A Person"/>
```

* *email* - ```string``` (required) - the email address to use for the Gravatar icon.
* *width* - ```integer``` (optional) - the width of the Gravatar icon. Default: 20
* *height* - ```integer``` (optional) - the height of the Gravatar icon. Default: 20
* *name* - ```integer``` (optional) - the name to use for the alt text of the Gravatar icon. Default: *email*
* *default-image* - ```string``` - (optional) - the default image to use if no Gravatar user is found. Default: 'mm'

### Time Ago

### Kapp Header

Usage:
```
<!-- Provide the header with a Kapp object. -->
<kinetic-header kapp="currentKapp"/>

<!-- If you don't have the Kapp object, provide it with the slug. -->
<kinetic-header kapp-slug="my-kapp"/>

<!-- An example of injecting additional menu items.
<script>
var adminLinks = [
  {
    // The title to appear in the dropdown.
    title: 'Kapp Setup',
    // The icon to appear to the left of the title.
    iconClass: 'fa-wrench',
    // Optional function to determine if it is visible to the user.
    visibility: function() {
      return true;
    },
    // The state to go to.
    sref: 'setup'
  }
];
</script>
<kinetic-header kapp-slug="my-kapp" admin-links="adminLinks"/>
```

Attributes:
* *kapp* - ```object``` A JavaScript object, the current kapp.
* *kappSlug* - (Optional) ```string``` Specify the slug of the current kapp. The component will then query Core for the necessary details.
* *adminLinks* - (Optional) ```object```

## Services

### Toast

### Slugifier

## REST Models

### Form Model

### Form Types Model

### Space Model

### Submission Model

#### Submission Searcher

### Attribute Definition Model

#### Core API Module
