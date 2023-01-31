angular.module("app", ["templates"])
  .directive("app", () => {
    return {
      scope: {},
      restrict: "E",
      templateUrl: "./js/app/app.tpl.html",
      controller: ["$scope", "$element", appDataCtrl],
    };
    function appDataCtrl($scope, $element) {
      $scope.data = ( () => { console.log('initializing data....') ; return makeDefaulData();} )()
      $scope.currentItem;
      $scope.isShowTime=true;
      $scope.sortBy= 'title';
      $scope.findBy = '';
      $scope.newItemLabel = '';
      $scope.setCurrent = ( item ) => {  $scope.currentItem = item ; console.log( $scope.currentItem  ) ; };
      $scope.getItemById = ( id = $scope.currentItem ) => $scope.data.find( i => i.id === id ) ;
      $scope.$watch('findBy' , () => { $scope.currentItem =  ( x => x ? x : $scope.currentItem )( $scope.data.find( x => x.title === $scope.findBy )?.id)}, false) ;
      $scope.addItem = () => $scope.data.push( $scope.createItem( $scope.newItemLabel ) ) ;
      $scope.createItem = (title) => ({id: makeDataId(), title: title, tags:[], date: (new Date()).toJSON() }) ;
      $scope.delCurItemTagByIndex = (tagIndex) => $scope.getItemById().tags.splice(tagIndex, 1) ;
      $scope.addCurItemTag = ( tag ) => $scope.getItemById().tags.push(tag) ;
    }
  })
  .directive("contentView", () => {
    return {
      scope: {ctrlScope : "=ctrlscope"  },
      restrict: "E",
      templateUrl: "./js/app/content-view.tpl.html",
    };
  })

  .directive("sidebarView", () => {
    return {
      scope: {ctrlScope : "=ctrlscope"  },
      restrict: "E",
      templateUrl: "./js/app/sidebar-view.tpl.html",
      controller: ["$scope", "$element", sidebarViewCtrl],
    };
    function sidebarViewCtrl($scope, $element) {
      $scope.tag; 
      $scope.addTag = () =>{  $scope.ctrlScope.addCurItemTag($scope.tag);  $scope.tag = ''}
    }  
  })

  .directive("elementsView", () => {
    return {
      scope: {},
      restrict: "E",
      templateUrl: "./js/app/elements-view.tpl.html",
      controller: ["$scope", "$element", elementsViewCtrl],
    };
    function elementsViewCtrl($scope, $element) {
      $scope.model = {
        width: 300,
      };
      $scope.setWidth = () => {
        let width = $scope.model.width;
        if (!width) {
          width = 1;
          $scope.model.width = width;
        }
        $element.css("width", `${width}px`);
      };
      $scope.setWidth();
    }
  })

  .directive("some1", () => {
    return {
      scope: {ctrlScope : "=ctrlscope"  },
      restrict: "E",
      template: 
         `<some-2 ctrlscope = 'ctrlScope' > </some-2> 
         <form class="content-view__item" ng-submit="ctrlScope.addItem()">
          <label>Label: <input type="string" ng-model="ctrlScope.newItemLabel" ></label>
          <button type="submit">Add</button>
         </form>`
     ,
    };
  })

  .directive("some2", () => {
    return {
      scope: { ctrlScope : "=ctrlscope"  },
      restrict: "E",
      template: 
      `<some-3 ctrlscope = 'ctrlScope'></some-3>
      <div> 
        <ng-container ng-repeat="item in ctrlScope.data | orderBy: ctrlScope.sortBy  ">
          <div class="content-view__item" ng-class = "item.id == ctrlScope.currentItem ? 'content-view-selected':''"  ng-click = "ctrlScope.setCurrent(item.id)"> 
              <div> Title: {{item.title}} </div>
              <div> Date: {{ item.date | date :  ctrlScope.isShowTime ? 'MM/dd/yyyy @ h:mma' : 'MM/dd/yyyy'  }} </div>
          </div>
        </ng-container> 
      </div>`,
    };
  })

  .directive("some3", () => {
    return {
      scope: {ctrlScope : "=ctrlscope"},
      restrict: "E",
      template: 
        `<summary-view curentitem = 'ctrlScope.getItemById()' data = 'ctrlScope.data'   ></summary-view> 
        <div class="content-view__item"> 
        <label>Order by:</label> 
          <select name='order' ng-model='ctrlScope.sortBy'> <option value='title' >Title</option> <option value='date' >Date</option> </select> 
          <br>
        <label>Show time:</label> 
        <input type="checkbox" ng-model="ctrlScope.isShowTime">
          <br>
        <label>Search: </label>   
        <input ng-model="ctrlScope.findBy">
      </div>`
    };
  })

  .directive("summaryView", () => {
    return {
      scope: { data : "=data "  },
      restrict: "E",
      templateUrl: "./js/app/summary-view.tpl.html",
      controller: ["$scope", "$element", summaryViewCtrl],
    };
    function summaryViewCtrl($scope, $element) {
      $scope.lastDateElement = () => $scope.data.reduce( (a,x) => a && new Date(a.date) > new Date(x.date) ? a : x , undefined )
      $scope.uniqueTags = () => $scope.data.reduce( (a,x) => a.concat(x.tags), [] ).filter( (v,i,s) => s.indexOf(v) === i ) 
    }

  });

