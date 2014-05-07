/*jshint maxcomplexity:24, maxstatements:38 */
'use strict';

module.exports = function(app) {

	var request = require('request'),
		mime = require('node-mime'),
		uname = new Buffer('bmloYXJr=', 'base64').toString('ascii'),
		pass = new Buffer('Q0lpcGwyMDEw=', 'base64').toString('ascii'),
		geo = require('../lib/geo.js'),
		Timer = require('../lib/Timer.js'),
		cache = {},
		cacheDuration = 10000;

	app.get('/', function(req, res) {

		res.render('index', {
			url: '/live/id/:id',
			domain: 'domain'
		});

	});

	app.get('/match/:id', function(req, res) {

		var id = req.param('id') || null /* || 578625*/ ,
			protcol = 'http://',
			host = req.param('host') || 'www.espncricinfo.com' /*|| 'kilimanjaro.espncricinfo.com'*/ ,
			auth = false,
			path = '/ci/engine/match',
			url,
			ip = (req.headers['True-Client-IP'] || req.headers['x-forwarded-for'] || (req.connection.remoteAddress === '127.0.0.1' ? '116.72.156.25' /*'27.4.80.197' '199.88.194.29'*/ : req.connection.remoteAddress)),
			geoData = geo.get(ip),
			cluster = geoData.cluster,
			country = geoData.country,
			layout = req.param('layout') || 'live2optimized',
			cacheEnabled = ( !! req.param('cache'));

		auth = authRequired(host);

		url = protcol + (auth ? uname + ':' + pass + '@' : '') + host + path + '/' + id + '.json' + '?base=' + (req.param('base') || 1) + ';cluster=' + (req.param('cluster') || cluster) + ';country=' + (req.param('country') || country);

		if (cacheEnabled) {
			cache[url] = cache[url] || {};

			if (cache[url].data && (new Date() - cache[url].time < cacheDuration)) {
				res.render(layout, cache[url].data);
				return;
			}
		}

		var requestTime = Timer('requestTime');

		url = protcol + (auth ? uname + ':' + pass + '@' : '') + host + path + '/' + id + '.json' + '?base=' + (req.param('base') || 1) + ';cluster=' + (req.param('cluster') || cluster) + ';country=' + (req.param('country') || country);

		console.log(url); /*'http://www.espncricinfo.com/ci/engine/match/578625.json?base=1;cluster=ind;country=in'*/

		request.get({
			url: url,
			json: true
		}, function request(er, response, json) {

			console.log(requestTime.end());

			if (!er && response.statusCode === 200) {
				// json = {"ENABLE_LIVE_JSON":0,"ENABLE_NETSTORAGE":0,"Env_SERVER_NAME":"k.espncricinfo.com","HQserver":0,"ads":{"adtar":"","kvpt":"score","kvserobject":"566910","leaderboard":"<div class=\"topFrameBanner\">\r\n\r\n<script language=\"JavaScript\" type=\"text/javascript\">\r\ndocument.write('<script language=\"JavaScript\" src=\"http://ad.doubleclick.net/N6444/adj/espn.cricinfo.livescorecard/iccchampion…mpionstrophy2013;tile=1;sz=728x90,970x250,970x66,1x1;dcopt=ist;adtar=;ord=' + ord + '?\" type=\"text/javascript\"><\\/script>');\r\n</script><noscript><a href=\"http://ad.doubleclick.net/N6444/jump/espn.cricinfo.livescorecard/iccchampio…y2013;tile=1;sz=728x90,970x250,970x66,1x1;adtar=;dcopt=ist;ord=123456789?\" target=\"_blank\"><img src=\"http://ad.doubleclick.net/N6444/ad/espn.cricinfo.livescorecard/iccchampions…y2013;tile=1;sz=728x90,970x250,970x66,1x1;adtar=;dcopt=ist;ord=123456789?\" border=\"0\" alt=\"\"></a></noscript>\r\n\r\n</div>","strip_lhs_615":"","strip_rhs_310":"","url_component":"iccchampionstrophy2013"},"ballbyball_source":"feedback","cluster":"www","cms_menu":"","contentId":"48149","country":"unknown","description":"Cricket scores for ICC Champions Trophy, 12th Match, Group A: Australia v Sri Lanka at The Oval, Jun 17, 2013","keywords":"Australia v Sri Lanka, Live cricket score, Kennington Oval, London, London, List A matches","live_stream":"","livecontainer":"<div id=\"summary\" class=\"summary-block\">\r\n        <!-- Match Information -->\r\n        <div class=\"row brief-summary\">\r\n\t    <div class=\"large-14 medium-14 columns innings-information\">\r\n\t\t  <div class=\"team-1-name\">Sri Lanka</div>\r\n\t\t  <div class=\"team-2-name\">Australia</div>\r\n\t\t <div class=\"innings-requirement\">\r\n\t\t  Sri Lanka won by 20 runs\r\n\t\t </div>\r\n\t    </div>\r\n        </div>\r\n        <!-- End -->\r\n\r\n\t<!-- tie breaker block -->\r\n\t<div id=\"tiebreaker\">\r\n\t  <div class=\"row\">\r\n\t   <div class=\"large-20 columns commentary-block\">\r\n\r\n\t   </div>\r\n\t  </div>\r\n\t</div>\r\n\t<!-- end -->\r\n\r\n        <!-- Scorecard -->\r\n        <div class=\"row\">\r\n          <div class=\"large 20 columns scorecard\" style=\"position:relative;\">\r\n            <hr class=\"border-top-score-squad\">\r\n            <table class=\"squad-table\" width=\"100%\">\r\n\r\n            </table>\r\n            <table class=\"score-table\" width=\"100%\">\r\n\r\n            </table>\r\n            <div class=\"more-match-stats\">\r\n\r\n            </div>\r\n            \r\n          </div>\r\n        </div>\r\n        <!--  End -->\r\n      </div>\r\n\r\n      <div id=\"commentary\">\r\n        <!-- Commentary & Central Thin Colum -->\r\n        <div class=\"row\">\r\n          <!-- Commentary -->\r\n          <div class=\"large-20 medium-20 columns commentary-block\">\r\n\r\n          </div>\r\n\r\n      \t  <div class=\"large-4 medium-4 columns thin-incontent-block hide\">\r\n      \t               <div class=\"social-comm-section\">\r\n              \r\n              <h6>Commentator</h6>\r\n              <span>Devashish Fuloria</span>\r\n              \r\n              \r\n              <h6>Scorer</h6>\r\n              <span>Binoy George</span>\r\n              \r\n\t\t\t  \r\n\t\t\t\t\t<input type=\"button\" style=\"text-transform: none;\" class=\"commentary-feedback-buttoon palinBut\" value=\"Write to us\" /> \r\n\t\t\t  \r\n\t\t\t   <div class=\"clearfix\"></div>\r\n               <div id=\"social-icons\" style=\"float: left; margin-left:5px;\">\r\n\t\t\t\t\t\t<div class=\"ci-fb-button\" style=\"float: left; width: 100%;\">\r\n\t\t\t\t\t\t\r\n\t\t\t\t\t\t\t<div style=\"margin: 10px 0 0px 5px; overflow: hidden; text-align: left;\">\r\n\t\t\t\t\t\t\t\t<iframe src=\"//www.facebook.com/plugins/like.php?locale=en_US&amp;href=http%3A%2F%2Fk.espn…amp;show_faces=false&amp;share=false&amp;height=21&amp;appId=260890547115\" scrolling=\"no\" frameborder=\"0\" style=\"border:none; overflow:hidden; width:87px; height:21px;\" allowTransparency=\"true\"></iframe>\r\n\t\t\t\t\t\t\t</div>\r\n\t\t\t\t\t\t</div>\r\n\t\t\t\t\t\t<div class=\"ci-twt-button\" style=\"float: left; width: 100%;\">\r\n\t\t\t\t\t\t\t<div style=\"margin: 10px 0 10px 5px; overflow: hidden; text-align: left;\">\r\n\t\t\t\t\t\t\t\t<a href=\"http%253A%252F%252Fk.espncricinfo.com%252Fci%252Fengine%252Fmatch%252F578625.json\" data-url=\"http%253A%252F%252Fk.espncricinfo.com%252Fci%252Fengine%252Fmatch%252F578625.json\" class=\"twitter-share-button\" data-via=\"ESPNCricinfo\">Tweet</a>\r\n<script>!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+'://platform.twitter.com/widgets.js';fjs.parentNode.insertBefore(js,fjs);}}(document, 'script', 'twitter-wjs');</script>\r\n\t\t\t\t\t\t\t</div>\r\n\t\t\t\t\t\t</div>\r\n\t\t\t\t\t\t\r\n               </div>\r\n               <hr class=\"thick-2\">\r\n            </div>\r\n\t<div id=\"reports-column\">\r\n            \r\n\t</div>\r\n\r\n      \t  </div>\r\n\r\n      </div>\r\n\r\n      <div class=\"row\">\r\n        <!-- filters, comm feedback and social icons start-->\r\n        <div class=\"large-20 medium-20 columns filters-block\">\r\n            <hr>\r\n            <div class=\"row\">\r\n              <div class=\"large-12 medium-12 columns\">\r\n                <ul class=\"inline-list commentary-main-events-links\">\r\n                  <li><a href=\"/ci/engine/match/578625.html?innings=2;type=fours;view=commentary;wrappertype=none\">Fours</a></li>\r\n                  <li><a href=\"/ci/engine/match/578625.html?innings=2;type=sixes;view=commentary;wrappertype=none\">Sixes</a></li>\r\n                  <li class=\"remove-border-right\"><a href=\"/ci/engine/match/578625.html?innings=2;type=wickets;view=commentary;wrappertype=none\">Wickets</a></li>\r\n                </ul>\r\n              </div>\r\n              <div class=\"large-8 medium-8 columns\">\r\n                <a href=\"#\" class=\"small button radius commentary-feedback-buttoon\">Commentary Feedback</a>\r\n              </div>\r\n            </div>\r\n\r\n            <hr class=\"thick-2\">\r\n\r\n        </div>\r\n      </div>\r\n    </div>","match":{"bitly_hash":"","live_commentator":"Devashish Fuloria","live_match":"Y","live_scorer":"Binoy George","match_status":"complete"},"matchId":"578625","match_coverage":"<!-- Match Coverage -  -->      \r\n        <div class=\"large-20 columns match-coverage-block\" id=\"match-coverage-full\">\r\n          <hr class=\"secondary-hr\">\r\n          <div class=\"row\">\r\n            <div class=\"large-10 medium-20 columns\">\r\n              <div class=\"playtime\">\r\n\t\t        <span class=\"small-bold\">Hours of play (local time)</span>\r\n\t\t        13.00 start, First Session 13.00-16.30, Interval 16.30-17.15, Second Session 17.15-20.45\r\n              </div>\r\n            </div>\r\n            <div class=\"large-10 medium-20 columns\">\r\n              <div class=\"row\">\r\n                <div class=\"large-9 medium-9 columns\">\r\n                  <ul class=\"match-block-list\">\r\n                    <li><a href=\"/ci/content/series/566910.html\" target=\"_blank\">Tournament home</a></li>\r\n                    <li><a href=\"/ci/content/ground/57127.html\" target=\"_blank\">Ground page</a></li>\r\n                  </ul>\r\n                </div>\r\n                \r\n                <div class=\"large-11 medium-11 columns\">\r\n                  <ul class=\"match-inline-list\">\r\n                    <li><a href=\"/australia/content/team/2.html\" target=\"_blank\">Australia home</a>\r\n                    | <a href=\"/ci/content/squad/633275.html\" target=\"_blank\">squad</a>\r\n                    </li>\r\n                    <li><a href=\"/srilanka/content/team/8.html\" target=\"_blank\">Sri Lanka home</a>\r\n                    | <a href=\"/ci/content/squad/633544.html\" target=\"_blank\">squad</a>\r\n                    </li>\r\n                    <li><a href=\"/ci/content/squad/639599.html\" target=\"_blank\">Match officials</a></li>\r\n                  </ul>\r\n                </div>\r\n                \r\n              </div>\r\n            </div>\r\n          </div>\r\n          <hr class=\"thick-2\">\r\n          <h2 class=\"uppercase\">Match Coverage</h2>\r\n          <hr class=\"secondary-hr\">\r\n          <div class=\"row\">\r\n            <div class=\"large-20 columns\"> \r\n              <dl class=\"tabs inline-list coverage-day-list\">\r\n                <dd class=\"active\"><a href=\"#matchdayCoverage\">Match Day</a></dd>\r\n                <dd class=\"remove-border-right\"><a href=\"#previewCoverage\">Preview</a></dd>\r\n              </dl>\r\n              <hr>\r\n              <ul class=\"tabs-content\">\r\n                  <li class=\"\" id=\"previewCoverageTab\">\r\n                      <ul class=\"headlines-list\">\r\n                          <li>\r\n                            <a href=\"/ci/content/story/642601.html\" target=\"_blank\">\r\n                            <span class=\"bold\">Preview</span> - <span>Three teams queue up for semi spot</span>\r\n                            </a>\r\n                          </li>\r\n                          <li>\r\n                            <a href=\"/ci/content/story/642645.html\" target=\"_blank\">\r\n                            <span class=\"bold\">Features</span> - <span>'Role model' Sangakkara remains at the top of his game</span>\r\n                            </a>\r\n                          </li>\r\n                          <li>\r\n                            <a href=\"/ci/content/story/642649.html\" target=\"_blank\">\r\n                            <span class=\"bold\">News</span> - <span>Australia focused, Clarke remains hopeful </span>\r\n                            </a>\r\n                          </li>\r\n                      </ul>\r\n                  </li>\r\n                  <li class=\"active\" id=\"matchdayCoverageTab\">\r\n                      <ul class=\"headlines-list\">\r\n                          <li>\r\n                            <a href=\"/ci/content/story/642831.html\" target=\"_blank\">\r\n                            <span class=\"bold\">Report</span> - <span>Sri Lanka hold their nerve to reach semi-final</span>\r\n                            </a>\r\n                          </li>\r\n                          <li>\r\n                            <a href=\"/ci/content/story/642999.html\" target=\"_blank\">\r\n                            <span class=\"bold\">#report</span> - <span>When Clarke gave Bailey the Moyes glare</span>\r\n                            </a>\r\n                          </li>\r\n                          <li>\r\n                            <a href=\"/ci/content/story/643003.html\" target=\"_blank\">\r\n                            <span class=\"bold\">Features</span> - <span>Malinga does his Usain Bolt</span>\r\n                            </a>\r\n                          </li>\r\n                          <li>\r\n                            <a href=\"/ci/content/story/643011.html\" target=\"_blank\">\r\n                            <span class=\"bold\">Match Analysis</span> - <span>Watson's diminishing returns</span>\r\n                            </a>\r\n                          </li>\r\n                          <li>\r\n                            <a href=\"/ci/content/story/643015.html\" target=\"_blank\">\r\n                            <span class=\"bold\">Match Analysis</span> - <span>The remake that has gone bust</span>\r\n                            </a>\r\n                          </li>\r\n                          <li>\r\n                            <a href=\"/ci/content/story/643045.html\" target=\"_blank\">\r\n                            <span class=\"bold\">Match Analysis</span> - <span>Sri Lanka propelled by a little Mahela magic</span>\r\n                            </a>\r\n                          </li>\r\n                          <li>\r\n                            <a href=\"/ci/content/story/643033.html\" target=\"_blank\">\r\n                            <span class=\"bold\">The Long Handle</span> - <span>From gaudily dressed duffers to crimson-clad superheroes </span>\r\n                            </a>\r\n                          </li>\r\n                          <li class=\"media-list\">\r\n                            <a href=\"/ci/content/video_audio/643009.html\" target=\"_blank\">\r\n                              <span class=\"bold\">The Huddle</span> - <span>'Jayawardene stepped up to the mark today'</span>\r\n                            </a>\r\n                          </li>\r\n                          <li class=\"media-list\">\r\n                            <a href=\"/ci/content/video_audio/643027.html\" target=\"_blank\">\r\n                              <span class=\"bold\">Press Conference</span> - <span>'There was a bit of bad luck against NZ' - Bailey</span>\r\n                            </a>\r\n                          </li>\r\n                          <li class=\"media-list\">\r\n                            <a href=\"/ci/content/video_audio/643029.html\" target=\"_blank\">\r\n                              <span class=\"bold\">Press Conference</span> - <span>'Situations dictated how the game was unfolding' - Jayawardene</span>\r\n                            </a>\r\n                          </li>\r\n                          <li>\r\n                            <a href=\"/ci/content/gallery/642941.html\" target=\"_blank\">\r\n                            <span class=\"bold\">Gallery</span> - <span>Jayawardene helps Sri Lanka to semi-final</span>\r\n                            </a>\r\n                          </li>\r\n                      </ul>\r\n                  </li>\r\n              </ul>\r\n          </div>\r\n          <hr class=\"thick-2\">\r\n\t  </div>      \r\n\t  <!-- End -->","match_info":"ICC Champions Trophy, 12th Match, Group A: Australia v Sri Lanka at The Oval, Jun 17, 2013","match_photos":{"columns":["object_id","status_id","status_name","format","content_id","photographer","date_taken","date","keywords","day","caption_short","caption_long","image_owner_id","copyright_name","width","height","path","image_genre_id","image_genre_description","image_genre_priority","image_genre_template","url_component","modified"],"results":[{"caption_long":"Tillakaratne Dilshan gets chased by his team-mates, Australia v Sri Lanka, Champions Trophy, Group A, The Oval, June 17, 2013","caption_short":"Tillakaratne Dilshan gets chased by his team-mates","content_id":"159891","copyright_name":"AFP","date":"Jun 17, 2013","date_taken":"2013-06-17","day":"0","format":"jpg","height":"110","image_genre_description":"General cricket photo","image_genre_id":"1","image_genre_priority":"2","image_genre_template":"","image_owner_id":"9","keywords":"","modified":"2013-06-17 21:06:15","object_id":"643007","path":"/db/PICTURES/CMS/159800/159891.icon.jpg","photographer":"","status_id":"3","status_name":"published","url_component":"icc-champions-trophy-2013","width":"130"},{"caption_long":"Tillakaratne Dilshan took the final wicket, Australia v Sri Lanka, Champions Trophy, Group A, The Oval, June 17, 2013","caption_short":"Tillakaratne Dilshan took the final wicket","content_id":"159889","copyright_name":"AFP","date":"Jun 17, 2013","date_taken":"2013-06-17","day":"0","format":"jpg","height":"130","image_genre_description":"General cricket photo","image_genre_id":"1","image_genre_priority":"2","image_genre_template":"","image_owner_id":"9","keywords":"","modified":"2013-06-17 21:06:29","object_id":"643005","path":"/db/PICTURES/CMS/159800/159889.icon.jpg","photographer":"","status_id":"3","status_name":"published","url_component":"icc-champions-trophy-2013","width":"100"}],"rows":"2"},"mtimes":{"app__css":1398145280,"app__js":1399266055,"espn__gfx__js":1399266055,"global__js":1399266055,"ie8__css":1397663889,"matchcenter__js":1399266084,"omniture_global__js":1380790968,"plugin__js":1396883904,"templates__js":1397663891},"sponsored_links":"<ul class=\"headlines-list sponsored-links\">\r\n\r\n <li><a href=\"/ci/content/url/406583.html\" class=\"criRecmndsLnk\" target=\"_blank\">Bupa</a>\r\n <p>Customised Health Insurance</p>\r\n </li>\r\n\r\n <li><a href=\"/ci/content/url/423336.html\" class=\"criRecmndsLnk\" target=\"_blank\">Send Money2India & get an autographed bat</a>\r\n <p>ICICI Money2India</p>\r\n </li>\r\n\r\n <li><a href=\"/ci/content/url/307683.html\" class=\"criRecmndsLnk\" target=\"_blank\">The best online rugby union coverage</a>\r\n <p>On ESPNscrum.com</p>\r\n </li>\r\n</ul>","tabs_live":"<div id=\"tabs_live\">\n        <div class=\"row\">\n            <div class=\"large-14 medium-14 columns\">\n                <ul class=\"tabs-block\">\n<li data-url='/ci/engine/match/578625.html?view=live;wrappertype=none' class='tab-summary' data-ajax-enabled='false' data-view='' oncontextmenu='return false'><a href=\"javascript: void(0)\" name=\"st_0\" class=\"selected\" id=\"st_0\" contextmenu=\"return false\">Summary</a></li><li data-url='/ci/engine/match/578625.html?view=scorecard;wrappertype=none' class='tab-full-scorecard' data-ajax-enabled='false' data-view='' oncontextmenu='return false'><a href=\"javascript: void(0)\" name=\"st_1\" class=\"\" id=\"st_1\" contextmenu=\"return false\">Full scorecard</a></li><li data-url='/ci/engine/match/578625.html?innings=1;page=1;view=commentary;wrappertype=none' class='tab-commentary' data-ajax-enabled='false' data-view='' oncontextmenu='return false'><a href=\"javascript: void(0)\" name=\"st_2\" class=\"\" id=\"st_2\" contextmenu=\"return false\">Commentary</a></li><li data-url='/ci/engine/match/578625.html?innings=1;view=fow;wrappertype=none' class='tab-statistics' data-ajax-enabled='false' data-view='1' oncontextmenu='return false'><a href=\"javascript: void(0)\" name=\"st_3\" class=\"\" id=\"st_3\" contextmenu=\"return false\">Statistics</a></li>                </ul>\n            </div>\n            \n            <div class=\"large-6 medium-6 columns\">\n\t\t\t\t\n                <ul class=\"icon-block inline-list\" data-view=\"\">\n                    <li data-url='/ci/engine/match/578625.html?innings=1;view=wagonwheel;wrappertype=none;' class=\"tab-graphs\" data-view=\"wagonwheel\" data-ajax-enabled='true'><a href=\"javascript: void(0);\"><img src=\"http://i.imgci.com/espncricinfo/scorecard/wagon_wheel.png\" alt=\"Wagon Wheel\" title=\"Wagon Wheel\"></a></li>\n                    <li data-url='/ci/engine/match/578625.html?innings=1;view=runsballs;wrappertype=none;' class=\"tab-graphs\" data-view=\"runs_balls\" data-ajax-enabled='true'><a href=\"javascript: void(0);\"><img src=\"http://i.imgci.com/espncricinfo/scorecard/player_v_player.png\" alt=\"Player v/s Player\" title=\"Player v/s Player\"></a></li>\n                    \n\t\t\t\t\t\n                    <li data-url='/ci/engine/match/578625.html?innings=1;view=manhattan;wrappertype=none;' class=\"tab-graphs\" data-view=\"manhattan\" data-ajax-enabled='true'><a href=\"javascript: void(0);\"><img src=\"http://i.imgci.com/espncricinfo/scorecard/manhattan.png\" alt=\"Manhattan\" title=\"Manhattan\"></a></li>\n                    \n                    <li data-url='/ci/engine/match/578625.html?view=hawkeye;wrappertype=none;' class=\"tab-hawkeye\" data-view=\"hawkeye\" data-ajax-enabled='true'><a href=\"javascript: void(0);\"><img src=\"http://i.imgci.com/espncricinfo/scorecard/hawkeye.png\" alt=\"Hawkeye\" title=\"Hawkeye\"></a></li>\n                </ul>\n            </div>\n            \n        </div>\n    </div>","team_names":[{"1":"Sri Lanka"},{"2":"Australia"}],"teamscores":"","title":"12th Match, Group A: Australia v Sri Lanka at The Oval, Jun 17, 2013 | Cricket Summary | ESPN cricinfo"};

				json.domain = 'http://www.espncricinfo.com';

				json.platform = global.process.title + ' ' + global.process.version;

				json.match.match_status = (json.match.match_status === 'complete') ? 1 : 0;

				json.domain = protcol + host;

				json.cluster = req.param('cluster') || cluster || 'ind';

				json.isUSA = json.cluster === 'usa' ? true : false;

				/*TODO: change ci to url component*/
				json.uri = 'www.espncricinfo.com' + path + '/' + json.matchId + '.html';

				json.page_url = protcol + json.uri;

				if (req.param('ns')) {
					json.ENABLE_NETSTORAGE = true;
				}

				json.twt_url = getTwitterUrl(json.match.bitly_hash, json.page_url);

				if (json.country === 'gb') {
					json.cqanswer = 'uk';
				} else if (json.country === 'unknown') {
					json.cqanswer = '99';
				} else {
					json.cqanswer = json.country;
				}

				json.lhs_615 = json.rhs_310 = isRegionA(json.cluster);

				json.showBet365 = isRegionB(json.cluster);

				if (req.param('time')) {
					json.requestTime = requestTime.time().time;
				}

				if (cacheEnabled) {
					cache[url].data = cache[url].data || json;
					cache[url].time = new Date();
				}

				res.render(layout, json);
			} else {
				res.render('errors/500');
			}
		});

		// IND, AUS, PAK, SL, GULF, EAP
		function isRegionA(cluster) {
			if (cluster === 'ind' || cluster === 'aus' || cluster === 'pak' || cluster === 'sl' || cluster === 'gulf' || cluster === 'eap') {
				return true;
			}
		}

		// UK, NZ, WI, WWW
		function isRegionB(cluster) {
			if (cluster === 'uk' || cluster === 'nz' || cluster === 'wi' || cluster === 'wwww') {
				return true;
			}
		}

		function authRequired(host) {
			if (/localcms|dev|hq/.test(host)) {
				return true;
			}
			return false;
		}

		function getTwitterUrl(bitly_hash, page_url) {
			var url = '';
			if (bitly_hash) {
				url = 'http://es.pn/' + bitly_hash;
			} else {
				url = page_url;
			}
			return url;
		}

	});

	app.get('/live/id/:id', function(req, res) {

		// Permanent redirect to new location
		res.writeHead(301, {
			Location: '/match/' + req.param('id') + _parsedUrl.search
		});
		res.end();

		return;

		var id = req.param('id') || 578625,
			protcol = 'http://',
			host = req.param('host') || 'kilimanjaro.espncricinfo.com',
			auth = false,
			path = '/ci/engine/match',
			url,
			ip = (req.headers['True-Client-IP'] || req.headers['x-forwarded-for'] || (req.connection.remoteAddress === '127.0.0.1' ? '116.72.156.25' /*'27.4.80.197' '199.88.194.29'*/ : req.connection.remoteAddress)),
			geoData = geo.get(ip),
			cluster = geoData.cluster,
			country = geoData.country,
			layout = req.param('layout') || 'live2optimized',
			cacheEnabled = ( !! req.param('cache'));

		if (/localcms|dev|hq/.test(host)) {
			auth = true;
		}

		url = protcol + (auth ? uname + ':' + pass + '@' : '') + host + path + '/' + id + '.json' + '?base=' + (req.param('base') || 1) + ';cluster=' + (req.param('cluster') || cluster) + ';country=' + (req.param('country') || country);

		if (cacheEnabled) {
			cache[url] = cache[url] || {};

			if (cache[url].data && (new Date() - cache[url].time < cacheDuration)) {
				res.render(layout, cache[url].data);
				return;
			}
		}

		var requestTime = Timer('requestTime');

		request.get({
			url: url,
			json: true
		}, function request(er, response, json) {

			requestTime.end();

			if (!er && response.statusCode === 200) {

				// var json = JSON.parse(body);

				// Append server details
				var processTime = Timer('processTime');

				json.date = Date();
				json.platform = global.process.title + ' ' + global.process.version;

				json.match.match_status = (json.match.match_status === 'complete') ? 1 : 0;
				json.domain = protcol + host;

				/*TODO: update hardcoded value*/
				json.cluster = req.param('cluster') || cluster || 'ind';
				json.isUSA = json.cluster === 'usa' ? true : false;
				/*TODO: change ci to url component*/
				json.uri = 'www.espncricinfo.com' + '/ci/engine/match/' + json.matchId + '.html';
				json.page_url = protcol + json.uri;

				if (req.param('ns')) {
					json.ENABLE_NETSTORAGE = true;
				}

				if (json.match.bitly_hash) {
					json.twt_url = 'http://es.pn/' + json.match.bitly_hash;
				} else {
					json.twt_url = json.page_url;
				}

				if (json.country === 'gb') {
					json.cqanswer = 'uk';
				} else if (json.country === 'unknown') {
					json.cqanswer = '99';
				} else {
					json.cqanswer = json.country;
				}

				if (json.cluster === 'ind' || json.cluster === 'aus' || json.cluster === 'pak' || json.cluster === 'sl' || json.cluster === 'gulf' || json.cluster === 'eap') {
					json.lhs_615 = true;
					json.rhs_310 = true;
				}

				if (json.cluster === 'uk' || json.cluster === 'nz' || json.cluster === 'wi' || json.cluster === 'wwww') {
					json.showBet365 = true;
				}

				if (req.param('time')) {
					json.requestTime = requestTime.time().time;
				}

				if (cacheEnabled) {
					cache[url].data = cache[url].data || json;
					cache[url].time = new Date();
				}

				// console.log('Rendered');
				// processTime.end();
				console.log(processTime.end(), '------------------- PROCESS TIME -------------------');
				var renderTime = Timer('renderTime');
				res.render(layout, json);
				console.log(renderTime.end(), '------------------- RENDER TIME -------------------');

			} else {
				// console.log('else error');
				res.render('errors/500');
			}
		});
	});

	app.get('/proxy', function(req, res) {

		var url = req.param('url');

		if (/hq/.test(url)) {
			url = 'http://' + uname + ':' + pass + '@' + url.split('http://')[1];
		}

		request.get(url, function(err, re, body) {

			if (!err) {

				res.setHeader('Content-Type', re.headers['content-type']);
				res.setHeader('Access-Control-Allow-Origin', '*');
				res.setHeader('Cache-Control', 'max-age=10');

				if (mime.types[re.headers['content-type'].split(';')[0]] === 'map') {
					res.json(JSON.parse(body));
				} else {
					res.end(body);
				}

			} else {
				res.render('index');
			}
		});
	});
};