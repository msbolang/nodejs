/* 2017-10-25 nodejs实现基础的小爬虫 抓取
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 * 安装cheerio模块处理获取到的元素 这个模块和jquery一样使用$()....获取元素内容
 * 安装cheerio模块： npm install cheerio
 */
var http = require('http');
var cheerio = require('cheerio');
var baseUrl = 'http://www.imooc.com/learn/';
//var url = 'http://www.imooc.com/learn/348';
var videoIds = [348, 259, 197, 134, 75];

function filterChapters(html) {
    var $ = cheerio.load(html);
    var chapters = $('.chapter');

    var title = $('.course-infos .hd h2').text();
    var number = parseInt($('.statics .js-learn-num').text().trim(), 10);


    var courseData = {
        title: title,
        number: number,
        videos: []
    };

    chapters.each(function (item) {
        var chapter = $(this);
        var chapterTitle = chapter.find('strong').text();
        var video = chapter.find('.video').children('li');
        var chapterData = {
            chapterTitle: chapterTitle,
            videos: []
        }

        video.each(function (item) {
            var video = $(this).find('.J-media-item');
            var videoTitle = video.text();
            var id = video.attr('href').split('video/')[1];
            chapterData.videos.push({
                title: videoTitle,
                id: id
            })
        });
        courseData.videos.push(chapterData);

    });
    return courseData;
}

//打印
function printCourseInfo(courseData) {


    courseData.forEach(function (courseData) {
        console.log(1111111111);
        console.log(courseData.number + ' 人学过 ' + courseData.title + '\n');
    })


    courseData.forEach(function (courseData) {
        console.log('###' + courseData.title + '\n');

        courseData.videos.forEach(function (item) {
            var chapterTitle = item.chapterTitle;
            console.log(chapterTitle + '\n');
            item.videos.forEach(function (v) {
                console.log('[' + v.id + ']' + v.title + '\n');
            });
        });
    })
}

function getPageAsync(url) {
    return new Promise(function (resolve, reject) {
        console.log('正在爬取 ' + url);
        
            http.get(url, function (res) {
      
        var html = '';
        res.on('data', function (data) {
            html += data;
        });

        res.on('end', function () {
            resolve(html);
            //  var courseDate = filterChapters(html);
            //  printCourseInfo(courseDate);
        })
    }).on('error', function (e) {
        reject(e);
        console.log('获取数据出错！');
    });
    });



}


var fetchCourseArray = [];

videoIds.forEach(function (id) {
    fetchCourseArray.push(getPageAsync(baseUrl + id));
});

Promise
        .all(fetchCourseArray)
        .then(function (pages) {
            var courseData = []

            pages.forEach(function (html) {
                var courses = filterChapters(html);
                courseData.push(courses);
            })

            courseData.sort(function (a, b) {
                return a.number < b.number;
            });
            
            printCourseInfo(courseData);
        })



