from django.http import HttpResponse
import datetime
import pytz

from django.shortcuts import render
#from django.template.loader import get_template
from django.http import HttpResponse



def hello(request):
	#now = datetime.datetime.now()
	#html = "<html><body>It is now %s.</body></html>" % now
	return HttpResponse("Hello World")

def current_datetime(request):

	now = datetime.datetime.now(tz=pytz.timezone('America/New_York'))
	#t = get_template('current_datetime.html')
	#html = t.render({'current_date': now})
	#html = "<html><body>It is now %s.</body></html>" % now 
	return render(request, 'current_datetime.html',{'current_date':now})


def hours_ahead(request,delta):

	try:
		delta = str(delta)

	except ValueError:
		raise Http404()
	dt = datetime.datetime.now(tz=pytz.timezone('America/New_York')) + datetime.timedelta(hours=delta)
	html = "<html><body>In %s hour(s), it will be %s.</body></html>" % (delta,dt)

	return HttpResponse(html)
