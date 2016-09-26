<nav>
	<ul>
		<li><a id="myWordListMenuItem" href="#" <?php if( !isset( $_POST[ "menuItem" ] ) || $_POST[ "menuItem" ] != "myWord" ) echo 'class="active"' ?> >My wordlist</a></li>
		<li><a id="myWordMenuItem" href="#" <?php if( ( isset( $_POST[ "menuItem" ] ) && $_POST[ "menuItem" ] == "myWord" ) ) echo 'class="active"' ?> >My words</a></li>
	</ul>
</nav>