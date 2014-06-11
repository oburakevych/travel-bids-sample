var TimeUtil = {
	countdownThreashould: 60000
};

TimeUtil.MILLIS_IN_SECOND = 1000;
TimeUtil.ZERO_DATE = new Date(0); //01.01.1970 00:00:00
TimeUtil.ZERO_DATE_DAYS = TimeUtil.ZERO_DATE.getDate();
TimeUtil.ZERO_DATE.HOURS = TimeUtil.ZERO_DATE.getHours();
TimeUtil.ZERO_DATE.MINUTES = TimeUtil.ZERO_DATE.getMinutes();

TimeUtil.TIME_FORMAT_SEPARATOR  = ":";
TimeUtil.SECONDS_APPENDING_TEXT = " seconds";

TimeUtil.millisToSeconds = function(millis) {
	return Math.round(millis/TimeUtil.MILLIS_IN_SECOND);
}

TimeUtil.millisToReadableText = function(millis) {
	if (millis > TimeUtil.countdownThreashould) {
		return TimeUtil.millisToReadableCountDownText(millis);
	} else {
		return TimeUtil.millisToFinalCountDownText(millis);
	}
}

TimeUtil.millisToFinalCountDownText = function(millis) {
	var readableText = null;
	
	var seconds = TimeUtil.millisToSeconds(millis);
	if (seconds <= 0) {
		switch(seconds) {
			case 0:
				readableText = "COUNTING ONCE";
				break;
			case -1:
				readableText = "COUNTING TWICE";
				break;
			case -2:
				readableText = "FINAL CALL";
				break;
			case -3:
				readableText = "VERIFYING";
				break;
			case -4:
				readableText = "VERIFYING";
				break;
			case -5:
				readableText = "FINISHED";
				break;
			default: 
				readableText = "FINISHED";
		}
	} else {
		readableText = seconds + TimeUtil.SECONDS_APPENDING_TEXT;
	}

	return readableText;
}

TimeUtil.millisToReadableCountDownText = function(millis) {
	var date = new Date(millis);

	var days = date.getDate() - TimeUtil.ZERO_DATE_DAYS;
	var	hours = date.getHours() - TimeUtil.ZERO_DATE.HOURS;
	var minutes = date.getMinutes() - TimeUtil.ZERO_DATE.MINUTES;
	var seconds = date.getSeconds();

	if (hours < 10) {
		hours = "0" + hours;
	}

	if (minutes < 10) {
		minutes = "0" + minutes;
	}

	if (seconds < 10) {
		seconds = "0" + seconds;
	}

	return hours + TimeUtil.TIME_FORMAT_SEPARATOR 
				+ minutes + TimeUtil.TIME_FORMAT_SEPARATOR
				+ seconds;

}