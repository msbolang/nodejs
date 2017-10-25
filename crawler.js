/* 2017-10-25 nodejs实现基础的小爬虫 抓取
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 * 安装cheerio模块处理获取到的元素 这个模块和jquery一样使用$()....获取元素内容
 * 安装cheerio模块： npm install cheerio
 */
var http = require('http');
var cheerio = require('cheerio');
var url = 'http://www.imooc.com/learn/348';

function filterChapters(html) {
    var $ = cheerio.load(html);
    var chapters = $('.chapter');

    var courseData = [];

    chapters.each(function (item) {
        var chapter = $(this);
        var chapterTitle = chapter.find('strong').text();
        var video = chapter.find('.video').children('li');
        var chapterData = {
            chapterTitle: chapterTitle,
            videos: []
        }
        
       video.each(function(item){
           var video = $(this).find('.J-media-item');
           var videoTitle = video.text();
           var id = video.attr('href').split('video/')[1];
           chapterData.videos.push({
               title:videoTitle,
               id: id
           })
       });
       courseData.push(chapterData);
       
    });
    return courseData;
}

//打印
function printCourseInfo(courseData){
    courseData.forEach(function(item){
        var chapterTitle = item.chapterTitle;
        console.log(chapterTitle + '\n');
        item.videos.forEach(function(v){
            console.log('[' + v.id + ']' + v.title + '\n');
        });
    })
}

http.get(url, function (res) {
    var html = '';
    res.on('data', function (data) {
        html += data;
    });

    res.on('end', function () {
      var courseDate = filterChapters(html);
      printCourseInfo(courseDate);
    })
}).on('error', function () {
    console.log('获取数据出错！');
});

