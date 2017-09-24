var dns = require('@google-cloud/dns')({
  projectId: 'firecoral-dns',
  keyFilename: './key.json'
});

/*
 *  Usage:
 *  https:[GoogleCloudURL]/dns2?host=foo.bar.com&ip=192.168.1.1&zone=my-zone
 *  all query parameters are required.
 *
 *  TTL and record type are hardcoded to 300 and 'A'.  This assumes that there
 *  will only be one type A record for the given name and TTL.
 *
 *  Security discussion:
 *  This uses service security key meaning that if the url and argument
 *  syntax are exposed, anyone can mess with your DNS server.  For me
 *  this was not an issue, since I am using this to provide dynamic DNS
 *  service to a pfSense security device - if the pfSense device is hacked
 *  then the exposer of dynamic DNS is the least of my concerns.
 *
 *  If you are using this code for a more public service, you probably want
 *  to use OAuth2 to secure it.
 *
 *  This: https://github.com/GoogleCloudPlatform/google-cloud-node considers
 *  the DNS interface to be an alpha quality API and could be easily broken
 *  with further development.
 */

exports.dns2 = function dns2 (req, res) { 
  var ip = req.query.ip;
  var host = req.query.host;
  var zone = req.query.zone;
  if (!ip || !host || !zone) {
    res.send('Sorry'); // intentionally vague for security reasons
    return;
  }
  try {
    var zone = dns.zone(zone);
  }
  catch (err) {
    // dns.zone doesn't throw many errors.  You may have to check the
    // console log to determine what went wrong here.
    res.send(err); 
    return;
  }

  var query = {
    name: host,
    type: 'A',
    maxResults: 1
  };
  zone.getRecords(query)
    .then((data) => {
      var oldRecord = data[0][0];
      var newRecord = zone.record('a', {
	"name": host,
	"data": ip,
	"ttl": 300
      });
      config = {
        add: newRecord,
	delete: oldRecord 
      };
      return zone.createChange(config).then( (data) => console.log('Updating ' + host + ': ' + config.delete.data + ' => ' + ip));
    })
    .catch((err) => console.log(err)); 
  res.send('done');
  return;
}; 
