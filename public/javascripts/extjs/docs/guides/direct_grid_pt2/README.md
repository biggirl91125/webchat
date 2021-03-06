How to map an Ext 4 Grid to a MySQL table using Ext Direct and PHP (Part 2: CRUD)
=================================================================================

Duration: around 30 minutes

I. Introduction
---------------
In [the last tutorial](#!/guide/direct_grid_pt1) we created a grid that pulled information from a MySQL database using Ext Direct. Through the power and simplicity of grids we created what was essentially a glorified table (albeit 'turbocharged'). To add to the dynamism that grids present to us we'll be adding CRUD (Create, Read, Update, Delete) capabilities as well. A typical scenario that benefits from this is backend interfaces where a client might want to do anything from update someone's address or rename a blog post. We've already got it reading from a database so we're a quarter of the way there already!

By the end of this tutorial, we should have something that looks like this.

{@img grid-full.png The final product}

II. Getting Started
-------------------
### 2.1 Requirements

You will need:

*   A server with PHP (5.3+) and MySQL (4.1.3+) installed
*   A browser compatible with Ext JS 4 and debugging tools
*   A text editor

Personally, I find Firefox with Firebug best for debugging Ext.

It's highly recommended that you complete Part 1 before embarking on this tutorial to fully understand what we're doing. The base files that we'll be following on from [can be found here](guides/direct_grid_pt1/start.zip).

III. Writing the Application
----------------------------

### 3.1 API

Carrying on from our last tutorial in this series, we wrote a file called grid.js that housed the JavaScript portion of our Ext application. Now, if we're going to move forward to this brave new world of CRUDing we need to make some modifications.

Within our store variable we want to change the proxy to go from having a single Direct function (getting the results) to having four functions that will create, read, update and delete. To do this, the following is needed:

grid.js

	proxy: {
		type: 'direct',
		api: {
			create: QueryDatabase.createRecord,
			read: QueryDatabase.getResults,
			update: QueryDatabase.updateRecords,
			destroy: QueryDatabase.destroyRecord
		}
	},

So there should no longer be a `directFn`, it's been replaced by a more robust API. Writing this tells it that it's looking for a class called QueryDatabase and the method name (e.g. createRecord).

Next, we're going to expose these methods in our api.php file, in the first tutorial we added getResults to our server-side API, now we're going to add the names of our other functions that we'll be creating shortly.

api.php

	<?php
	$API = array(
	    'QueryDatabase'=>array(
	        'methods'=>array(
	            'getResults'=>array(
	                'len'=>1
	            ),
	            'createRecord'=>array(
	            	'len'=>1
	            ),
	            'updateRecords'=>array(
	            	'len'=>1
	            ),
	            'destroyRecord'=>array(
	            	'len'=>1
	            )
	        )
	    )
	);

### 3.2 Plugin

Beneath this, we're going to add a plugin for grids called the Row Editor. This will give an overlay that makes it really simple for users to change a field's content and looks just like this:

{@img row-editor.png Row Editor in action}

grid.js

	...
	var rowEditing = Ext.create('Ext.grid.plugin.RowEditing', {
		clicksToMoveEditor: 1,
		autoCancel: false
	});

By declaring it as a variable, it'll make it easier to use later on, as for the configuration options, `clicksToMoveEditor` is how many times the user clicks to move to a different record in our grid. `autoCancel` means that they can't discard changes before moving on and will bring up an arrow pointing to the record saying that they need to commit their changes first. Whenever adding a new component it's well worth checking out the {@link Ext.grid.plugin.RowEditing corresponding API documentation on it} to find out all the configuration possibilities.

We also need to specify a field type for each of the fields we'll want to edit in the grid, simply append the following to the name, address and state columns:

grid.js

	...
	text: 'Name',
	field: {
		type: 'textfield',
		allowBlank: false
	}

For the State column, we're going to add a validation check as well.

grid.js

	...
	allowBlank: false,
	vtype: 'alpha'

`vtype` stands for validation type and we're asking to only allow characters from the alphabet to be entered into this field as no state has a number in it. However, if you try to add a record and type a state with a space in it, e.g. New York, you'll find that you're not able to type spaces because we've _only_ allowed characters in the alphabet. To get around this we need to write a custom `vtype`.

Above our grid variable, create a new variable called alphaSpaceTest, the funny looking string after this is a 'regular expression' which will only allow hyphens, white space and letters.

grid.js

	...
	var alphaSpaceTest = /^[-\sa-zA-Z]+$/;

	Ext.apply(Ext.form.field.VTypes, {
	    //  vtype validation function
	    alphaSpace: function(val, field) {
	        return alphaSpaceTest.test(val);
	    },
	    // vtype Text property: The error text to display when the validation function returns false
	    alphaSpaceText: 'Not a valid state, must not contain numbers or special characters.',
	    // vtype Mask property: The keystroke filter mask
	    alphaSpaceMask: /^[-\sa-zA-Z]+$/
	});

Then change the vtype that previously read `vtype: alpha` to `vtype: alphaSpace` and we'll have the best of both worlds.

To actually be able to edit our grid with the nice Row Editor interface we need to reference the plugin we created earlier. Still within the grid variable write:

grid.js

	...
	plugins: [
		rowEditing
	],

### 3.3 UI

So far our grid looks a tad sparse, we're now going to beef it up a bit and add some extra controls with minimal effort. Within our grid variable we're going to add a property called `dockedItems` that will hold all of the information for our gorgeous UI.

grid.js

	...
	dockedItems: [{
		xtype: 'toolbar',
		store: store,
		dock: 'bottom',
	}]

Setting the `xtype` to a toolbar will house the buttons that we'll create later on. You can also try [experimenting with the dock](http://docs.sencha.com/ext-js/4-0/#!/api/Ext.panel.Panel-cfg-dockedItems) seeing which position you prefer (possible values are top, left, right and bottom) and even try `frame: true`, it's just a matter of preference.

### 3.4 Updating

We now want to add a function that will update our MySQL table through our QueryDatabase.php file. Because this is a feature that could be used multiple times in one session, we're using the MySQLi prepare statement for it's [security and speed improvements](http://www.linearchat.co.uk/2011/08/why-prepared-statements-in-mysql-are-a-good-thing/).

QueryDatabase.php

	...
	public function updateRecords(stdClass $params)
	{
		$_db = $this->__construct();

		if ($stmt = $_db->prepare("UPDATE owners SET name=?, address=?, state=? WHERE id=?")) {
			$stmt->bind_param('sssd', $name, $address, $state, $id);

			$name = $params->name;
			$address = $params->address;
			$state = $params->state;
			//cast id to int
			$id = (int) $params->id;

			$stmt->execute();

			$stmt->close();
		}

		return $this;
	}

When we say `bind_param`, we're telling it the order and type that our variables will appear in, so `sssd` means three strings and a decimal variable. Slightly counter-intuitively, we then say what those variables are and force the id to be an integer, by default it is a string because of the way it's been parsed with Ext Direct. We then execute the statement and close it.

You'll see that when you update a record's value a small, red right triangle will appear on the field that you updated, if you click the refresh button on the dock you should hopefully find that it has been saved and the triangle disappears!

### 3.5 Creating

In life, creation is the most complicated process but with Ext we'll get through it without too much sweat. To start, within our dockedItems we want to add a button for the user to click to add a record. To do this, we make an array of items.

grid.js

	...
	items: [
	{
		iconCls: 'add',
		text: 'Add'
	}]

The `iconCls` will be referenced in our own CSS file to give it an appropriate icon. This is just the aesthetics, to make it function properly we'll have to add a `handler` and work our PHP magic.

A handler can either be a reference to a function variable or contain the function inline, in this case I've done it inline but you could arrange your file with all of the CRUD functions at the top or bottom and reference it like `handler: addRecord`.

grid.js

	...
	text: 'Add',
	handler: function() {
		rowEditing.cancelEdit();
		// create a record
		var newRecord = Ext.create('PersonalInfo');

		// insert into store and start editing that record
		store.insert(0, newRecord);
		rowEditing.startEdit(0, 0);

		// get the selection model in order to get which record is selected
		var sm = grid.getSelectionModel();

		// after user clicks off from editing, sync the store, remove the record from the top and reload the store to see new changes
		grid.on('edit', function() {
			var record = sm.getSelection()
			store.sync();
			store.remove(record);
			store.load();
		});
	}

This anonymous function first cancels editing if another record is being edited, and then creates a new record from our PersonalInfo model, this inserts blank values for our name, address and state fields. We then insert this 'phantom' record into the store using the insert method and then tell the row editor to start editing the top record - where we inserted the record. Once we've finished editing it, the edit event is called, to which we've added a function that'll get the internal ID of the record we just added, sync the new record so it's no longer a phantom. Left like this, it leaves a blank line at the top of our grid so we remove the previously selected record and then reload the store so our newly added record appears at the bottom of our grid. Still following? Good.

As wonderful as Ext is, it can't deal with the server side stuff for us so opening our QueryDatabase.php file we're going to create a new function that will insert records into the database.

QueryDatabase.php

	...
	public function createRecord(stdClass $params)
	{
		$_db = $this->__construct();
		if($stmt = $_db->prepare("INSERT INTO owners (name, address, state) VALUES (?, ?, ?)")) {
			$stmt->bind_param('sss', $name, $address, $state);

			$name = $_db->real_escape_string($params->name);
			$address = $_db->real_escape_string($params->address);
			$state = $_db->real_escape_string($params->state);

			$stmt->execute();
			$stmt->close();
		}

		return $this;
	}

Our function name corresponds to the name we set when declaring our API in grid.js, i.e. createRecord, we then say that 'data that comes from the class stdClass (from router.php) will be assigned to a variable called params, this is for added security so attacks can't be spoofed from another file. The data in question looks like this:

{@img creating-record.png Firebug showing the JSON that contains the data to create a record}

This clearly shows us which class and method is being invoked and includes a JSON data object that we access to get the individual fields for our database. The `tid` is the number of POST requests in this session, so this is the second (the first being when it loaded the data).

We then prepare our MySQL statement as we did before. The question marks are linked to the next line, where we bind parameters, the strange looking 'sss' denotes that there are three variables that are all strings which we then map afterwards, making sure to escape input into our database as one last security measure before executing our query.

### 3.7 Deleting

Destruction is always easier than creation and this next section will teach you how to be an Ext Shiva. We already have a button to add so now we're going to do the same process to delete, complete with a handler.

grid.js

	...
	}, {
	iconCls: 'delete',
	text: 'Delete',
	handler: function() {
		rowEditing.cancelEdit();
		var sm = grid.getSelectionModel();
		store.remove(sm.getSelection());
		store.sync();
	}

We've seen the first two parts before with adding so I'm going to jump straight to what we're doing with the handler. We get rid of the editing overlay if it's open, get which record is being selected in the grid, and then remove the row from the store (using the selection model) and finally sync everything up so our database is up-to-date with our store.

### 3.8 UX: Bare Buttons and Bad Behavior

Noticed that the buttons are looking a bit bare? To add an icon we're going to write some old school CSS. The classes aren't arbitrary, when coding our buttons we added an `iconCls` to each one, this adds the class name that we're now using in the CSS. I've also positioned the grid so that it's no longer tucked up in the top left corner.

style.css

	body {
		background: #ededed;
	}

	.grid {
		margin: 0 auto;
		position: relative;
		width: 700px;
		margin-top: 5px;
	}

	.add {
		background: url('images/add.png');
	}

	.delete {
		background: url('images/delete.png');
	}

Of course, we also have to link it in our index.html like so

index.html

	...
	<link rel="stylesheet" href="style.css" type="text/css">

As long as it's beneath the Ext CSS file and in the `<head>` tag it doesn't matter where you place it.

Something else you may have noticed is how easy it is to delete a record forever and how easily this might be done by mistake. To be less rude to our users we're going to add a dialog box to confirm deletions.

Dealing with confirming deletions isn't hard at all. First, we want to find the part of our code that deals with deleting things - our handler for the delete button. Second, we want to split the handler into two parts, destructive and non-destructive behavior. The first two lines are non-destructive so I've left them at the top so they get run as soon as the user clicks Delete, but we only want to remove and sync when they _confirm_ that that's what they want to do.

We invoke `Ext.Msg.show` with some configuration options. The title and message are self-explanatory, the buttons option dictates what buttons the user will be able to click on, in this case, Yes or No. We've also added an icon to the dialog so that the user knows immediately that an action is needed from them to continue. When the user does decide on one of the options and clicks the corresponding button we can check which one was chosen by supplying a callback function with `fn`. This is shorthand for function (no surprises) and works the same way as a handler on our Add and Delete buttons where we simply check if they said yes (always in lowercase) and if so, carry out what needs to be done. If we were being _really_ nice we could add an `else` and resume their editing where they left off.

grid.js

	  ...
	  handler: function() {
	      rowEditing.cancelEdit();
	      var sm = grid.getSelectionModel();

	      Ext.Msg.show({
	           title:'Delete Record?',
	           msg: 'You are deleting a record permanently, this cannot be undone. Proceed?',
	           buttons: Ext.Msg.YESNO,
	           icon: Ext.Msg.QUESTION,
	           fn: function(btn){
	           	if (btn === 'yes'){
	           		store.remove(sm.getSelection());
	           		store.sync();
	           	}
	           }
	      });
	  }

Voila, now we have a nice, user friendly message that confirms their actions.

IV. Conclusion
--------------
In this tutorial we've covered a lot of ground. You should now know how to implement Ext Direct to create, read, update and delete from a database. We've also looked at how easy Ext makes dialogs and alerts that have a direct impact on the application and create a better user experience overall.

If you're going to integrate this into production code, you could look into how to optimize it using [Ext Loader to only load the classes that we use](http://www.sencha.com/blog/using-ext-loader-for-your-application/) or process actions in batches with a 'Save changes' button so permanent changes aren't immediate.

Finally, for reference, you can find the [completed source files here](guides/direct_grid_pt1/reference-files.zip).
