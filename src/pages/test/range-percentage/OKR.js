import { useState, Fragment } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import parse from "html-react-parser";
import PercentageRange from "../../../components/sliders/PercentageRange";

export default function OKR() {
    const [perc, setPerc] = useState(0);
    const finishedKR = perc === 100;

    const handlePerc = (newPerc) => {
        setPerc(newPerc);
    };

    const showTitle = () => (
        <h1 className="mb-5 text-center text-title text-purple">
            OKR - Fiddelize
            <br />
            <span
                className="d-inline-block text-subtitle font-weight-bold"
                style={{ lineHeight: "30px" }}
            >
                Objetivos e
                <br />
                Resultados-Chaves
            </span>
        </h1>
    );

    const endDate = "23 de junho";
    const showObjective = (
        goal = "conseguir reconhecimento do mercado com <strong>500 primeiros clientes</strong> ativos"
    ) => (
        <section className="mb-5 text-purple">
            <h2 className="text-subtitle font-weight-bold text-center">
                Objetivo Atual:
                <br />
                <span
                    className="text-normal d-inline-block"
                    style={{
                        lineHeight: "30px",
                    }}
                >
                    {parse(goal)}
                </span>
            </h2>
            <h2 className="mt-2 text-normal font-weight-bold text-center">
                Período de duração:
                <br />
                {endDate}
            </h2>
        </section>
    );

    const showKR = ({ kr, mt = true }) => (
        <Fragment>
            <div className="position-relative">
                <h3
                    className={`${
                        mt ? "mt-5" : ""
                    } position-relative text-normal text-pill text-center`}
                    style={{
                        padding: "10px 15px",
                        bottom: -20,
                    }}
                >
                    {parse(kr)}
                </h3>
                {finishedKR && (
                    <div
                        className="position-absolute animated rubberBand"
                        style={{
                            bottom: -10,
                            right: 0,
                        }}
                    >
                        <FontAwesomeIcon
                            icon="check"
                            style={{
                                fontSize: "45px",
                                color: "var(--incomeGreen)",
                            }}
                        />
                    </div>
                )}
            </div>
            {finishedKR ? (
                <h4
                    className="position-relative text-center text-normal font-weight-bold text-sys-green"
                    style={{
                        bottom: -20,
                    }}
                >
                    Resultado atingido, parabéns!
                </h4>
            ) : (
                <h4
                    className="position-relative text-center text-subtitle font-weight-bold text-purple"
                    style={{
                        bottom: -20,
                    }}
                >
                    {perc}% concluído
                </h4>
            )}
            <PercentageRange perc={perc} handlePerc={handlePerc} />
        </Fragment>
    );

    return (
        <section className="container-center-col mx-4">
            {showTitle()}
            {showObjective()}
            <Fragment>
                <h2 className="text-purple text-subtitle font-weight-bold text-center">
                    Resultados-Chaves:
                </h2>
                {showKR({
                    kr:
                        "atingir os primeiros <br /><strong>100 clientes</strong>.",
                    mt: false,
                })}
                {showKR({
                    kr:
                        "atingir os primeiros <br /><strong>500 clientes</strong>",
                    mt: true,
                })}
            </Fragment>
        </section>
    );
}

/*
$(function() {
  $('.project').each(function() {
    var $projectBar = $(this).find('.bar');
    var $projectPercent = $(this).find('.percent');
    var $projectRange = $(this).find('.ui-slider-range');
    $projectBar.slider({
      range: "min",
      animate: true,
      value: 1,
      min: 0,
      max: 100,
      step: 1,
      slide: function(event, ui) {
        $projectPercent.val(ui.value + "%");
      },
      change: function(event, ui) {
        var $projectRange = $(this).find('.ui-slider-range');
        var percent = ui.value;
        if (percent < 30) {
          $projectPercent.css({
            'color': 'red'
          });
          $projectRange.css({
            'background': '#f20000'
          });
        } else if (percent > 31 && percent < 70) {
          $projectPercent.css({
            'color': 'gold'
          });
          $projectRange.css({
            'background': 'gold'
          });
        } else if (percent > 70) {
          $projectPercent.css({
            'color': 'green'
          });
          $projectRange.css({
            'background': 'green'
          });
        }
      }
    });
  })
})

 */
