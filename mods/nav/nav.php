<?php
	require_once $_SERVER[ 'DOCUMENT_ROOT' ] . '/config/constants.php';
	require_once $_SERVER[ 'DOCUMENT_ROOT' ] . '/mods/nav/navControl.php';
?>

<nav>
	<ul>
		<li><a id = 'test' href = '/mods/test/test.php' <?php checkActive( 'test' ); ?> >Test</a></li>
		<li><a id = 'myWordMenuItem' href = '/mods/word/word.php' <?php checkActive( 'word' ); ?> >My words</a></li>
		<li><a id = 'myWordListMenuItem' href = '/mods/wordlist/wordlist.php' <?php checkActive( 'wordList' ); ?> >My wordlist</a></li>
	</ul>
</nav>