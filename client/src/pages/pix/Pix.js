import React from "react";
import QrCode from "../../components/QrCode";
import Img from "../../components/Img.js";
import "./_Pix.scss";

export default function Pix() {
	return (
		<section className="mx-3 text-white">
			<section className="my-3 container-center">
				<img
					width={180}
					height="auto"
					src="/img/icons/pay/pix-name.png"
					alt="pix logo"
				/>
			</section>
			<section className="qr-root container-center my-5">
				<div className="qr-container">
					<QrCode
						value="0136947D2D86-0B8F-4E8D-8196-4933A"
						fgColor="var(--themeP)"
					/>
				</div>
			</section>
		</section>
	);
}
