# Request CE Bundle: Queue

## Summary

Queue is a kapp designed to contain "queues" of items to be worked on. By default it will show all submissions for all forms in its kapp of the Queue Type defined.

Additional Filters can be added in order to narrow down the visible queue items.

## Setup

Prerequisites:

The Queue kapp requires that the Admin kapp be installed. If you already have an older version of the Admin kapp installed you will need to ensure that
you create a Space Attribute and corresponding Attribute Definition called Admin Kapp Slug and set its value to the slug of the installed Admin kapp.

Queue also assumes that you have a group hierarchy already established in the Admin kapp. Groups are structured like this: Group Base::First Level::Second Level.
For example: Fulfillment::IT::Software and Fulfillment::HR::Service Desk result in four selectable groups in Queue: IT, IT::Software, HR, HR::Service Desk

1. Download the Queue source and put it in your Space Bundle folder (e.g. /app/bundles/acme)
2. Create a new kapp.
3. Set the Bundle Path to the folder name for the Queue bundle.
4. Click on View Kapp

If Queue has never been visited before it will first determine if any of its necessary Attribute Definitions are missing and will then create them. You will
see any missing ones appear briefly in orange. If it is able to successfully create them, they will change to green. You should not see them again.

### Queue Configuration

Queue's will need a small number of items configured to function.

* _Queue Name_ - This field represents the label on the screen that is displayed above the filters. It's just a helpful label which can be more descriptive than the kapp name.
* _Queue Details Value_ - This is the name of a field on your queue submissions which you want to be rendered as your description in the detailed view.
* _Queue Summary Value_ - This is the name of a field on your queue submissions which you want to be rendered as your description in the list view.
* _Queue Type_ - This is the *form type* you associate with any form whose submissions can be seen in this queue, allowing you to easily have other forms and submissions in the queue which are not visible by default.
* _Group Hierarchy Base_ - See the prerequisites section for more information on group configuration. This is the base 'group' which will begin the hierarchy for assignment in the queue.

### Queue Filter Configuration

Queue filters are basic submission filters. To set them up you first type in a filter name, which will appear as a button above the list and detail views, and click the plus button.
All the field filters in a given filter are cumulative: first AND second AND third. Your _Field_ should be either _coreState_ or _values[FIELDNAME]_. Your _Value_ can be any string.
There are two macros available: _${me}_ evaluates to the current user's username and _${openStatuses}_ evaluates to a list of "In Progress" and "Open". 

### Queue Form Management

You cannot manage your forms within Queue but you can easily create new forms from templates. On the _Form Generator_ tab first select a template to use as the basis for your new form
and then give it a name and a slug. By default Queue will create two templates: _Basic Queue Item Template_ and _Queue Item From Service Item_. When you select a template a helpful
description will appear beneath explaining the template's intended use.

You can create your own templates as well. A good rule of thumb is to clone an existing template, such as _Basic Queue Item Template_ as it will have all of the necessary fields on it.

If you need to create a template from scratch the following fields are necessary:

* Assigned Individual
* Assigned Individual Display Name
* Assigned Group
* Assigned Group Display Name
* Deferral Token
* Due Date (Date field type)
* Status - Statuses are arbitrary but by default we use Open, Pending, In Progress, and Complete.

All other fields are optional. The description at the top of the list view item and the title-bar of the detail view is the submission label.
