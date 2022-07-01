package com.bsev700.br.activities;

import android.os.Bundle;
import androidx.appcompat.widget.Toolbar;
import com.bsev700.br.R;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.widget.TextView;
import com.bsev700.br.util.Utils;
import android.text.Html;
import androidx.appcompat.app.AlertDialog;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.Button;

public class AboutActivity extends BaseActivity
{
	
	@Override
	protected void onCreate(Bundle savedInstanceState)
	{
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_about);

		// toolbar
		Toolbar mToolbar = (Toolbar) findViewById(R.id.toolbar_main);
		setSupportActionBar(mToolbar);
		getSupportActionBar().setDisplayHomeAsUpEnabled(true);

		try {
			PackageInfo pm = getPackageManager().getPackageInfo(getPackageName(), 0);
			String version = String.format("%s (Build %d)", pm.versionName, pm.versionCode);
		
			TextView versionName = (TextView) findViewById(R.id.versionName);
			versionName.setText(version);
		} catch (PackageManager.NameNotFoundException e) {}

		Button showLicense = (Button) findViewById(R.id.activity_aboutShowLicenseButton);
		showLicense.setOnClickListener(new View.OnClickListener() {
			@Override
			public void onClick(View v) {
				showLicenses();
			}
		});
		
		showAgradecimentos();
	}

	@Override
	public boolean onSupportNavigateUp()
	{
		onBackPressed();
		return true;
	}
	
	protected void showLicenses() {
		LayoutInflater li = LayoutInflater.from(this);
		View view = li.inflate(R.layout.fragment_dialog_licenses, null); 
		
		try
		{
			String aboutText = Utils.readFromAssets(this,"LICENSE");
			aboutText = aboutText.replace("\n","<br/>");
			
			((TextView) view.findViewById(R.id.fragment_dialog_licensesAllTextView))
				.setText(Html.fromHtml(aboutText));
		}
		catch (Exception e){}
		
		new AlertDialog.Builder(this)
            .setTitle("Licenses")
            .setView(view)
            .show();
	}
	
	public void showAgradecimentos() {
		try
		{
			String aboutText = Utils.readFromAssets(this,"AGRADECIMENTOS");
			aboutText = aboutText.replace("\n","<br/>");

			((TextView) findViewById(R.id.activity_aboutAgradecimentosTextView))
				.setText(Html.fromHtml(aboutText));
		}
		catch (Exception e){}
	}

	@Override
	protected void onResume()
	{
		// TODO: Implement this method
		super.onResume();

		}


	@Override
	protected void onPause()
	{
		// TODO: Implement this method
		super.onPause();

		}


	@Override
	protected void onDestroy()
	{
		// TODO: Implement this method
		super.onDestroy();

	}
	
}

