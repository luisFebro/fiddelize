package com.bsev700.br;

import androidx.drawerlayout.widget.DrawerLayout;
import androidx.appcompat.app.ActionBarDrawerToggle;
import androidx.appcompat.widget.Toolbar;
import com.google.android.material.navigation.NavigationView;
import android.content.pm.PackageInfo;
import com.bsev700.br.util.Utils;
import androidx.appcompat.app.AppCompatActivity;

import android.view.View;
import android.widget.TextView;
import androidx.annotation.NonNull;
import android.view.MenuItem;
import android.content.Intent;
import android.net.Uri;

import com.bsev700.br.activities.ConfigGeralActivity;

public class DrawerPanelMain
	implements NavigationView.OnNavigationItemSelectedListener
{
	private AppCompatActivity mActivity;
	
	public DrawerPanelMain(AppCompatActivity activity) {
		mActivity = activity;
	}
	

	private DrawerLayout drawerLayout;
	private ActionBarDrawerToggle toggle;

	public void setDrawer(Toolbar toolbar) {
		NavigationView drawerNavigationView = (NavigationView) mActivity.findViewById(R.id.drawerNavigationView);
		drawerLayout = (DrawerLayout) mActivity.findViewById(R.id.drawerLayoutMain);

		// set drawer
		toggle = new ActionBarDrawerToggle(mActivity,
			drawerLayout, toolbar, R.string.open, R.string.cancel);

        drawerLayout.setDrawerListener(toggle);

		toggle.syncState();

		// set app info
		PackageInfo pinfo = Utils.getAppInfo(mActivity);
		if (pinfo != null) {
			String version_nome = pinfo.versionName;
			int version_code = pinfo.versionCode;
			String header_text = String.format("v. %s (%d)", version_nome, version_code);

			View view = drawerNavigationView.getHeaderView(0);

			TextView app_info_text = view.findViewById(R.id.nav_headerAppVersion);
			app_info_text.setText(header_text);
		}

		// set navigation view
		drawerNavigationView.setNavigationItemSelectedListener(this);
	}
	
	public ActionBarDrawerToggle getToogle() {
		return toggle;
	}
	
	public DrawerLayout getDrawerLayout() {
		return drawerLayout;
	}
	
	@Override
	public boolean onNavigationItemSelected(@NonNull MenuItem item) {
		int id = item.getItemId();

		switch(id)
		{


			case R.id.miSettings:
				Intent intent = new Intent(mActivity, ConfigGeralActivity.class);
				intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
				mActivity.startActivity(intent);
				break;

			case R.id.miContato:
				String url1 = "https://t.me/BASEV700";
				Intent intent4 = new Intent(Intent.ACTION_VIEW, Uri.parse(url1));
				intent4.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
				mActivity.startActivity(Intent.createChooser(intent4, mActivity.getText(R.string.open_with)));
				break;

		}

		return true;
	}

}
