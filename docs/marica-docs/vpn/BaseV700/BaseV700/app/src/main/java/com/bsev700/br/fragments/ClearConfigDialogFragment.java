package com.bsev700.br.fragments;

import android.app.Dialog;
import android.app.AlertDialog;
import android.os.Bundle;
import android.content.DialogInterface;
import com.bsev700.br.R;

import androidx.fragment.app.DialogFragment;

import com.bsev700.ultrasshservice.logger.SkStatus;
import com.bsev700.br.BASEV700MainActivity;
import com.bsev700.ultrasshservice.config.Settings;

public class ClearConfigDialogFragment extends DialogFragment {

	@Override
	public Dialog onCreateDialog(Bundle savedInstanceState) {
		AlertDialog dialog = new AlertDialog.Builder(getActivity()).
			create();
		dialog.setTitle("Atenção!");
		dialog.setMessage(getActivity().getString(R.string.alert_clear_settings));

		dialog.setButton(DialogInterface.BUTTON_POSITIVE, getActivity().getString(R.
																				  string.yes),
			new DialogInterface.OnClickListener() {
				@Override
				public void onClick(DialogInterface dialog, int which) {
					Settings.clearSettings(getContext());

					// limpa logs
					SkStatus.clearLog();

					BASEV700MainActivity.updateMainViews(getContext());

					//Toast.makeText(getActivity(), R.string.success_clear_settings, Toast.LENGTH_SHORT)
					//	.show();
					System.exit(0);
				}
			}
		);

		dialog.setButton(DialogInterface.BUTTON_NEGATIVE, getActivity().getString(R.
																				  string.no),
			new DialogInterface.OnClickListener() {
				@Override
				public void onClick(DialogInterface dialog, int which) {
					dismiss();
				}
			}
		);

		return dialog;
	}

}

