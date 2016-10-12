<div id='testForm' class='testForm'>
	<form>
		<div class='testOptions'>
		    <input type="checkbox" name="group" id="displayPron" value="1" title="Main List" />
	    	<label for="displayPron" class='noselect'>Display pronunciation</label>
		</div>
		<div class='meaningDescription'>
			<b><span class='meaningLabel'>Meaning:</span></b>
			<span id='meaningSpan' data-wordId='' data-word='' data-wordlistName='' data-pronunciation=''></span>
		</div>
		<input id="inputWord" type="text" autocomplete="off" size="50" maxlength="50" class='inputWord'></input><br/>
		<span id='pronunciationSpan' class='pronunciationSpan'></span><br/>		
		<button type="submit" id="checkWordBtn">Check</button>
		<button id="showWordBtn">Show word</button>
		<button id="nextWordBtn">Next</button>
		<button id="retestBtn">Retest</button>
	</form>
	<span id='resultSpan' class='resultSpan'></span>
</div>