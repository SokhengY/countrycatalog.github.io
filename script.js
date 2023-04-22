$(document).ready(function(){

    var body = $('body');
    var popup = `<div class='popup'></div>`;

    function getPageList(totalPages, page, maxLength){
        function range(start, end){
            return Array.from(Array(end - start + 1), (_, i) => i + start);
        }

        var sidWidth = maxLength < 9 ? 1 : 2;
        var leftWidth = (maxLength - sidWidth * 2 - 3) >> 1;
        var rightWidth = (maxLength - sidWidth * 2 - 3) >> 1;

        if(totalPages <= maxLength){
            return range(1, totalPages);
        }

        if(page <= maxLength - sidWidth - 1 - rightWidth){
            return range(1, maxLength - sidWidth - 1).concat(0, range(totalPages - sidWidth + 1, totalPages));
        }

        if(page >= totalPages - sidWidth - 1 - rightWidth){
            return range(1, sidWidth).concat(0, range(totalPages - sidWidth - 1 - rightWidth - leftWidth, totalPages));
        }

        return range(1, sidWidth).concat(0, range(page - leftWidth, page + rightWidth), 0, range(totalPages - sidWidth + 1, totalPages));

    }

    var numberOfItems = 250;
    var limitPerPage = 25;
    var totalPages = Math.ceil(numberOfItems / limitPerPage);
    var paginationSize = 7;
    var currentPage;

    function showPage(whichPage){
        if(whichPage < 1 || whichPage > totalPages) return false;
        
        currentPage = whichPage;

        $(".card-content .card").hide().slice((currentPage - 1) * limitPerPage, currentPage * limitPerPage).show();

        $(".pagination li").slice(1, -1).remove();

        getPageList(totalPages, currentPage, paginationSize).forEach(item => {
            $("<li>").addClass("page-item").addClass(item ? "current-page" : "dots")
                .toggleClass("active", item === currentPage).append($("<a>").addClass("page-link")
                .attr({href: "javascript:void(0)"}).text(item || "...")).insertBefore(".next-page");
        });

        $(".previous-page").toggleClass("disable", currentPage === 1);
        $(".next-page").toggleClass("disable", currentPage === totalPages);
        return true;
    }

    $(".pagination").append(
        $("<li>").addClass("page-item").addClass("previous-page").append($("<a>").addClass("page-link").attr({href: "javascript:void(0)"}).text("Prev")),
        $("<li>").addClass("page-item").addClass("next-page").append($("<a>").addClass("page-link").attr({href: "javascript:void(0)"}).text("Next"))
    );

    $(".card-content").show();
    showPage(1);

    $(document).on("click", ".pagination li.current-page:not(.active)", function(){
        return showPage(+$(this).text());
    });

    $(".next-page").on("click", function(){
        return showPage(currentPage + 1);
    });

    $(".previous-page").on("click", function(){
        return showPage(currentPage - 1);
    });

    async function getcountry(){
        var url = `https://restcountries.com/v3.1/all`;
        var rp = await fetch(url);
        var rs = await rp.json();
        var txt = "";
        rs.forEach( (e)=>{
            txt +=`                    
                    <div class="card">
                        <div class="card-image"><img src="${e.flags.png}" alt=""></div>
                        <div class="card-info">
                            <h3 data-id="${e.ccn3}">${e.name.official}</h3>
                            <p>Code: ${e.cca2},${e.cca3}</p>
                            <p>Alternative Name: ${e.altSpellings}</p>
                            <p>Calling Codes: ${e.idd.suffixes}</p>
                        </div>
                    </div>
                `;
        });

        console.log(rs);
        $(".card-content").html(txt);

        var card = document.querySelectorAll(".card .card-info h3");
        console.log(card);
        card.forEach( (e)=>{
            $(e).on("click", function(){
                // alert("ok");
                body.append(popup);
                getCountryDetails(e.dataset.id);
            });
        });

        var numberOfItems = rs.length;
        console.log(numberOfItems);
    }
    getcountry();

    $('.search-container').on("keyup",".SearchName",function(){
        // alert("ok");
        var value = $(this).val().toLowerCase();
        $('.card').filter(function(){
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
        });
    }); 
    

    body.on("click",".detail .close", function(){
        $(".popup").remove();
    });


    async function getCountryDetails(ccn3){
        var url = `https://restcountries.com/v3.1/alpha?codes=${ccn3}`;
        var rp = await fetch(url);
        var rs = await rp.json();
        var txt = "";
        
        console.log(rs);
        rs.forEach( (e)=>{
            txt = `
            <div class="detail">
                <div class="close">
                    <i class="ri-close-fill"></i>
                </div>
                <div class="country-details">
                    <img src="${e.flags.png}" alt="" />
                    <div class="details-text-container">
                    <h1>${e.name.common}</h1>
                    <div class="details-text">
                        <p><b>Native Name:  </b><span class="native-name">${Object.values(e.name.nativeName)[0].common}</span></p>
                        <p><b>Population: </b><span class="population">${e.population.toLocaleString('en-IN')}</span></p>
                        <p><b>Capital: </b><span class="capital">${e.capital?.[0]}</span></p>
                        <p><b>Sub Region: </b><span class="sub-region">${e.subregion}</span></p>
                        <p><b>Currencies: </b><span class="currencies">${Object.values(e.currencies).map((currency) => currency.name).join(', ')}</span></p>
                        <p>
                        <b>Top Level Domain: </b><span class="top-level-domain">${e.tld.join(', ')}</span>
                        </p>
                        <p><b>Region: </b><span class="region">${e.region}</span></p>
                        <p><b>Languages: </b><span class="languages">${Object.values(e.languages).join(', ')}</span></p>
                    </div>
                    <div class="border-countries"><b>Border Countries: </b>&nbsp; ${e.borders}</div>
                    </div>
                </div>
            </div>
            `;
        });
        body.find(".popup").append(txt);
    } 





});