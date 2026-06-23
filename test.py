from html.parser import HTMLParser

html = """<select id="myselect">
  <template>
    <option value="1">One</option>
  </template>
</select>"""

class MyHTMLParser(HTMLParser):
    def handle_starttag(self, tag, attrs):
        print("Start tag:", tag)
    def handle_endtag(self, tag):
        print("End tag  :", tag)
    def handle_data(self, data):
        if data.strip():
            print("Data     :", data.strip())

parser = MyHTMLParser()
parser.feed(html)
