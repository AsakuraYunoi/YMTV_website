<template>
    <div class="team-container">
      <h1>历届团队成员展示</h1>
      <div class="shell" id="shell">
        <div class="header">
          <h2 class="title">山羊の前端小窝</h2>
          <h3 class="subtitle">BILIBILI</h3>
        </div>
        <div class="timeline">
          <div
            class="item"
            v-for="member in teamMembers"
            :key="member.id"
            :data-text="member.year"
          >
            <div class="content">
              <img :src="member.image" :alt="member.name" class="img" />
              <h2 class="content-title">{{ member.year }}</h2>
              <p class="content-desc">
                {{ member.description }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import $ from 'jquery';
  
  export default {
    name: 'TeamIntroduction',
    data() {
      return {
        teamMembers: [
          {
            id: 1,
            year: '2002',
            name: '成员A',
            image: 'https://www.ysjf.com/static/header/img/team_pan.webp', // 示例图片URL
            description: '如果你停止，就是谷底。如果你还在继续，就是上坡。这是我听过关于人生低谷最好的阐述。',
          },
          {
            id: 2,
            year: '2003',
            name: '成员B',
            image: 'https://www.ysjf.com/static/header/img/team_xiao.webp', // 示例图片URL
            description: '如果你停止，就是谷底。如果你还在继续，就是上坡。这是我听过关于人生低谷最好的阐述。',
          },
          {
            id: 3,
            year: '2004',
            name: '成员C',
            image: 'https://www.ysjf.com/static/header/img/team_oleg.webp', // 示例图片URL
            description: '如果你停止，就是谷底。如果你还在继续，就是上坡。这是我听过关于人生低谷最好的阐述。',
          },
          {
            id: 4,
            year: '2005',
            name: '成员D',
            image: 'https://www.ysjf.com/static/header/img/team_zhang.webp', // 示例图片URL
            description: '如果你停止，就是谷底。如果你还在继续，就是上坡。这是我听过关于人生低谷最好的阐述。',
          },
          {
            id: 5,
            year: '2006',
            name: '成员E',
            image: 'https://www.ysjf.com/static/header/img/team_li.webp', // 示例图片URL
            description: '如果你停止，就是谷底。如果你还在继续，就是上坡。这是我听过关于人生低谷最好的阐述。',
          },
          {
            id: 6,
            year: '2007',
            name: '成员F',
            image: 'https://www.ysjf.com/static/header/img/team_wang.webp', // 示例图片URL
            description: '如果你停止，就是谷底。如果你还在继续，就是上坡。这是我听过关于人生低谷最好的阐述。',
          },
          {
            id: 7,
            year: '2008',
            name: '成员G',
            image: 'https://www.ysjf.com/static/header/img/team_zhao.webp', // 示例图片URL
            description: '如果你停止，就是谷底。如果你还在继续，就是上坡。这是我听过关于人生低谷最好的阐述。',
          },
          {
            id: 8,
            year: '2009',
            name: '成员H',
            image: 'https://www.ysjf.com/static/header/img/team_chen.webp', // 示例图片URL
            description: '如果你停止，就是谷底。如果你还在继续，就是上坡。这是我听过关于人生低谷最好的阐述。',
          },
          {
            id: 9,
            year: '2025',
            name: '成员I',
            image: 'https://www.ysjf.com/static/header/img/team_chen.webp', // 示例图片URL
            description: '如果你停止，就是谷底。如果你还在继续，就是上坡。这是我听过关于人生低谷最好的阐述。',
          },
        ],
      };
    },
    mounted() {
      $(() => {
        $.fn.timeline = function () {
          var selectors = {
            id: $(this),
            item: $(this).find(".item"),
            activeClass: "item--active",
            img: ".img"
          };
          selectors.item.eq(0).addClass(selectors.activeClass);
          selectors.id.css(
            "background-image",
            "url(" +
              selectors.item.first().find(selectors.img).attr("src") +
              ")"
          );
          var itemLength = selectors.item.length;
          $(window).scroll(function () {
            var max, min;
            var pos = $(this).scrollTop();
            selectors.item.each(function (i) {
              min = $(this).offset().top;
              max = $(this).height() + $(this).offset().top;
              var that = $(this);
              if (i == itemLength - 2 && pos > min + $(this).height() / 2) {
                selectors.item.removeClass(selectors.activeClass);
                selectors.id.css(
                  "background-image",
                  "url(" +
                    selectors.item.last().find(selectors.img).attr("src") +
                    ")"
                );
                selectors.item.last().addClass(selectors.activeClass);
              } else if (pos <= max - 10 && pos >= min) {
                selectors.id.css(
                  "background-image",
                  "url(" +
                    $(this).find(selectors.img).attr("src") +
                    ")"
                );
                selectors.item.removeClass(selectors.activeClass);
                $(this).addClass(selectors.activeClass);
              }
            });
          });
        };
        $("#shell").timeline();
      });
    },
  
  };
  </script>
  
  <style scoped>
  * {
    padding: 0;
    margin: 0;
  }
  
  .team-container {
    font-family: 'Arial', sans-serif;
    color: #333;
  }
  
  .team-container h1 {
    text-align: center;
    margin-bottom: 20px;
    color: #000;
  }
  
  
  .shell {
    width: 100%;
    position: relative;
    padding: 80px 0;
    transition: 0.3s ease 0s;
    background-attachment: fixed;
    background-size: cover;
  }
  
  .shell:before {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(99, 99, 99, 0.8);
    content: "";
  }
  
  .header {
    width: 100%;
    text-align: center;
    margin-bottom: 80px;
    position: relative;
  }
  
  .title {
    color: #fff;
    font-size: 46px;
    font-weight: normal;
    margin: 0;
  }
  
  .subtitle {
    color: rgba(255, 255, 255, 0.5);
    font-size: 16px;
    letter-spacing: 5px;
    margin: 10px 0 0 0;
    font-weight: normal;
  }
  
  .timeline {
    display: flex;
    margin: 0 auto;
    flex-wrap: wrap;
    flex-direction: column;
    max-width: 700px;
    position: relative;
  }
  
  .timeline:before {
    position: absolute;
    left: 50%;
    width: 2px;
    height: 100%;
    margin-left: -1px;
    content: "";
    background: rgba(255, 255, 255, 0.07);
  }
  
  .item {
    padding: 40px 0;
    opacity: 0.3;
    filter: blur(2px);
    transition: 0.5s;
    box-sizing: border-box;
    width: calc(50% - 40px);
    display: flex;
    position: relative;
    transform: translateY(-80px);
  }
  
  .item:before {
    content: attr(data-text);
    letter-spacing: 3px;
    width: 100%;
    position: absolute;
    color: rgba(255, 255, 255, 0.5);
    font-size: 13px;
    border-left: 2px solid rgba(255, 255, 255, 0.5);
    top: 70%;
    margin-top: -5px;
    padding-left: 15px;
    opacity: 0;
    right: calc(-100% - 56px);
    font: 900 20px '';
    letter-spacing: 5px;
  }
  
  .item:nth-child(even) {
    align-self: flex-end;
  }
  
  .item:nth-child(even):before {
    right: auto;
    text-align: right;
    left: calc(-100% - 56px);
    padding-left: 0;
    border-left: none;
    border-right: 2px solid rgba(255, 255, 255, 0.5);
    padding-right: 15px;
  }
  
  .item--active {
    opacity: 1;
    transform: translateY(0);
    filter: blur(0px);
  }
  
  .item--active:before {
    top: 50%;
    transition: 0.3s all 0.2s;
    opacity: 1;
  }
  
  .content-title {
    font-weight: normal;
    font-size: 66px;
    margin: -10px 0 0 0;
    transition: 0.4s;
    padding: 0 10px;
    box-sizing: border-box;
    color: #fff;
  }
  
  .item--active .content-title {
    margin: -50px 0 20px 0;
  }
  
  
  .content-desc {
    margin: 0;
    font-size: 15px;
    box-sizing: border-box;
    color: rgba(255, 255, 255, 0.7);
    line-height: 25px;
  }
  
  
  .img {
    max-width: 100%;
    box-shadow: 0 10px 15px rgba(0, 0, 0, 0.4);
  }
  
  
  .footer {
    padding: 95px 0;
    text-align: center;
  }
  
  .footer a {
    color: #999;
    display: inline-block;
  }
  
  @media only screen and (max-width: 767px) {
    .item {
      align-self: baseline !important;
      width: 100%;
      padding: 0 30px 150px 80px;
    }
  
    .item:before {
      left: 10px !important;
      padding: 0 !important;
      top: 50px;
      text-align: center !important;
      width: 60px;
      border: none !important;
    }
  
    .item:last-child {
      padding-bottom: 40px;
    }
  }
  
  @media only screen and (max-width: 767px) {
    .timeline:before {
      left: 40px;
    }
  }
  </style>