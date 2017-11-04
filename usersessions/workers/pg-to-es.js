var rs = fs.createReadStream('./sessioninfo.csv', { encoding: 'utf8' });
var opts = {
  url: 'https://caa3de72bd5ffce2b12a61289f202ca0.us-west-1.aws.found.io:9243/usersession', // Elasticsearch endpoint
  nosql: 'postgres',
  db: 'usersessions'
}
nosqlimport.importStream(rs, null, opts, function (err, data) {
  assert.equal(typeof data, 'object');
  assert.equal(data.total, 26)
  assert.equal(data.totalfailed, 0)
  assert.equal(err, null);
  done();
});