<nav>
	<ul>
		<li><a id="myWordMenuItem" href="/mods/word/word.php" <?php if( ( !isset( $_POST[ "menuItem" ] ) || $_POST[ "menuItem" ] == "myWord" ) ) echo 'class="active"' ?> >My words</a></li>
		<li><a id="myWordListMenuItem" href="/mods/wordlist/wordlist.php" <?php if( isset( $_POST[ "menuItem" ] ) && $_POST[ "menuItem" ] == "myWordList" ) echo 'class="active"' ?> >My wordlist</a></li>
	</ul>
</nav>